'use server'
import { eventHandler } from "vinxi/http";
import { getCookie } from '../routes/api/utils'
import { redisHGet, redisHSet } from "../routes/api/lib/redis/hash";
import { pool } from "../routes/api/db";
import { redis } from "../routes/api/redis";
import { redisDel, redisExists } from "../routes/api/lib/redis/basic";

export const user_peers = globalThis.__USER_PEERS__ || (globalThis.__USER_PEERS__ = new Map());
export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      const origin = peer.request.headers.get('origin')
      if (origin !== import.meta.env.VITE_URL) return peer.terminate()
      const session_id = getCookie('auth.session-token', peer.request.headers.get('cookie'))
      if (!session_id) return peer.close(1008, 'Session expired.')
      const user_id = await redisHGet(`user:session:${session_id}`, 'user_id');
      if (!user_id) return peer.close(1008, 'Session expired.')

      const device_id = await redisHGet(`user:session:${session_id}`, 'device_id');
      if (!device_id) return peer.close(1008, 'Session expired.')

      if (!user_peers.has(user_id)) user_peers.set(user_id, new Map())
      user_peers.get(user_id).set(device_id, peer)
      if (!peer.topics.has(`connected-device-${user_id}`)) peer.subscribe(`connected-device-${user_id}`)
      peer.user_id = user_id
      peer.device_id = device_id
      peer.is_alive = true
      peer.send('ping')
      peer.ping_interval = setInterval(() => {
        if (!peer.is_alive) return peer.close(1001, "Didn't receive ping")
        peer.is_alive = false
        peer.send('ping')
      }, 30000)
    },
    async message(peer, msg) {
      const user_id = peer.user_id
      if (!user_id || !user_peers.has(user_id)) return peer.close(1008, 'Session expired.')

      if (msg.text() === 'pong') return peer.is_alive = true
      const data = JSON.parse(msg.text())
      switch (data.type) {
        case 'approve-login': {
          const pid = await redisExists(`pending:verification:${data.pending_verification_id}`)
          if (!pid) return
          await redisHSet(`pending:verification:${data.pending_verification_id}`, { status: 'trusted' })
          const device_id = await redisHGet(`pending:verification:${data.pending_verification_id}`, 'device_id')
          const user_id = await redisHGet(`pending:verification:${data.pending_verification_id}`, 'user_id')
          await pool.query(`
            UPDATE user_devices
              SET status='trusted', pending_verification_id=NULL
            WHERE id=$1 AND user_id=$2`, [device_id, user_id]
          )
          break;
        }
        case 'reject-login': {
          const pid = await redisExists(`pending:verification:${data.pending_verification_id}`)
          if (!pid) return
          await redisHSet(`pending:verification:${data.pending_verification_id}`, { status: 'blocked' })
          const device_id = await redisHGet(`pending:verification:${data.pending_verification_id}`, 'device_id')
          const user_id = await redisHGet(`pending:verification:${data.pending_verification_id}`, 'user_id')
          await pool.query(`
            UPDATE user_devices
              SET status='blocked', pending_verification_id=NULL
            WHERE id=$1 AND user_id=$2`, [device_id, user_id]
          )
          break;
        }
        case 'logout-device': {
          const {device_id, session_id} = data
          const user_id = await redisHGet(`user:session:${session_id}`, 'user_id');
          if (!user_id) return peer.close(1008, 'Session expired.')

          await pool.query(`
            UPDATE user_devices
              SET session_id=null
            WHERE user_id=$1 AND id=$2 AND session_id=$3
          `, [user_id, device_id, session_id])
          await redisDel(`user:session:${session_id}`)
          await redis.sRem(`user:sessions:${user_id}`, session_id)
          user_peers.get(user_id).delete(device_id)
          peer.publish(`connected-device-${user_id}`, JSON.stringify({
            type: `logout-device-${device_id}`
          }))
          break;
        }
        case 'block-device': {
          const {session_id, device_id} = data
          const user_id = await redisHGet(`user:session:${session_id}`, 'user_id');
          if (!user_id) return peer.close(1008, 'Session expired.')

          await pool.query(`
            UPDATE user_devices
              SET status='blocked', session_id=null
            WHERE session_id=$1 AND user_id=$2`, [session_id, user_id]
          )
          await redisDel(`user:session:${session_id}`)
          await redis.sRem(`user:sessions:${user_id}`, session_id)
          
          user_peers.get(user_id).delete(device_id)
          peer.publish(`connected-device-${user_id}`, JSON.stringify({
            type: `logout-device-${device_id}`
          }))
          break;
        }
      }
    },
    async close(peer, details) {
      const user_id = peer.user_id
      const device_id = peer.device_id
      if (peer.topics.has(`connected-device-${user_id}`)) peer.unsubscribe(`connected-device-${user_id}`)

      if (user_id && device_id && user_peers.has(user_id)) {
        const peers = user_peers.get(user_id)
        if (peers.size === 1) {
          user_peers.delete(user_id)
          return
        }
        if (peers.has(device_id)) peers.delete(device_id)
      }
      clearInterval(peer.ping_interval)
    },
    async error(peer, error) {
      peer.terminate()
    },
  },
})