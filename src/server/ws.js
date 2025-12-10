'use server'
import { eventHandler } from "vinxi/http";
import { getCookie } from '../routes/api/utils'
import { redisHGet, redisHSet } from "../routes/api/lib/redis/hash";
import { pool } from "../routes/api/db";

export const user_peers = globalThis.__USER_PEERS__ ??= new Map();

export default eventHandler({
  handler(event) {},
  websocket: {
    async open(peer) {
      const origin = peer.request.headers.get('origin')
      if (origin !== import.meta.env.VITE_URL) {
        peer.terminate()
        return
      }
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return peer.close(1008, 'Session expired.')
      const user_id = await redisHGet(`user:session:${session_id}`, 'user_id');
      if (!user_id) return peer.close(1008, 'Session expired.')

      if (!user_peers.has(user_id)) user_peers.set(user_id, new Set())
      user_peers.get(user_id).add(peer)
    },
    async message(peer, msg) {
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return peer.close(1008, 'Session expired.')
      const user_id = await redisHGet(`user:session:${session_id}`, 'user_id');
      if (!user_id) return peer.close(1008, 'Session expired.')

      const data = JSON.parse(msg.text())
      switch (data.type) {
        case 'approve-login': {
          await redisHSet(`temp_device:${data.temp_device_id}`, { status: 'active' })
          await pool.query(`
            UPDATE user_devices
              SET status='active' 
            WHERE id=$1`, [data.temp_device_id]
          )
          break;
        }
        case 'reject-login': {
          await redisHSet(`temp_device:${data.temp_device_id}`, { status: 'blocked' })
          await pool.query(`
            UPDATE user_devices
            SET status='blocked' 
            WHERE id=$1`, [data.temp_device_id]
          )
          break;
        }
      }
    },
    async close(peer, details) {
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      const user_id = session_id ? await redisHGet(`user:session:${session_id}`, 'user_id') : null;

      if (user_id && user_peers.has(user_id)) {
        const peers = user_peers.get(user_id)
        if (peers.size === 1) user_peers.delete(user_id)
        else peers.delete(peer)
      }
      peer.terminate()
    },
    async error(peer, error) {
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      const user_id = session_id ? await redisHGet(`user:session:${session_id}`, 'user_id') : null;

      if (user_id && user_peers.has(user_id)) {
        const peers = user_peers.get(user_id)
        if (peers.size === 1) user_peers.delete(user_id)
        else peers.delete(peer)
      }
      peer.terminate()
    },
  },
})