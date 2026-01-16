'use server'
import { user_peers } from "./ws"

export const notify_user_new_device = async (user_id, payload) => {
    if (!user_peers.has(user_id)) return
    const all_user_devices = user_peers.get(user_id)

    for (const devices of all_user_devices) {
        const peer = devices[1]
        peer.send(JSON.stringify(payload))
    }
}

export const publish_to_device = async (user_id, device_id = null) => {
    if (!user_peers.has(user_id)) return
    const all_user_devices = user_peers.get(user_id)
    for (const devices of all_user_devices) {
        const device = devices[0]
        const peer = devices[1]
        if (device_id && (device === device_id)) continue
        peer.send(JSON.stringify({
            type: `logout-device-${device}`
        }))
    }
}   