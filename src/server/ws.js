'use server'
import { eventHandler } from "vinxi/http";
import { getCookie } from '../routes/api/utils'
import { redisGet } from '../routes/api/lib/redis/basic';
import { redisHSet } from "../routes/api/lib/redis/hash";
import { pool } from "../routes/api/db";

export const user_peers = globalThis.__USER_PEERS__ ??= new Map();

export default eventHandler({
  handler() { },
  websocket: {
    async open(peer) {
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return
      const session_data = await redisGet(`user:session:${session_id}`);
      if (!session_data) return
      const { user_id } = JSON.parse(session_data)

      if (!user_peers.has(user_id)) user_peers.set(user_id, new Set())
      user_peers.get(user_id).add(peer)
    },
    async message(peer, msg) {
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return
      const session_data = await redisGet(`user:session:${session_id}`);
      if (!session_data) return
      const { user_id } = JSON.parse(session_data)

      const data = JSON.parse(msg.text())
      switch (data.type) {
        case 'ping': {
          peer.send(JSON.stringify({ type: 'pong' }))
          break;
        }
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
      if (!session_id) return
      const session_data = await redisGet(`user:session:${session_id}`);
      if (!session_data) return
      const { user_id } = JSON.parse(session_data)

      if (user_peers.has(user_id)) {
        if (user_peers.get(user_id).size === 1) user_peers.delete(user_id)
        else user_peers.get(user_id).delete(peer)
      }
      peer.terminate()
    },
    async error(peer, error) {
      console.log('error', peer.id, error)
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return
      const session_data = await redisGet(`user:session:${session_id}`);
      if (!session_data) return
      const { user_id } = JSON.parse(session_data)

      if (user_peers.has(user_id)) {
        if (user_peers.get(user_id).size === 1) user_peers.delete(user_id)
        else user_peers.get(user_id).delete(peer)
      }
      peer.terminate()
    },
  },
});