'use server'
import { user_peers } from "./ws"

export const notify_user_new_device = async (user_id, payload) => {
    if(!user_peers.has(user_id)) return
    const all_user_peers = user_peers.get(user_id)

    for (const peer of all_user_peers) {
        peer.send(JSON.stringify(payload))
    }
}