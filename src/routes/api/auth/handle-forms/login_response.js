'use server'

import { json } from "@solidjs/router"
import { randomUUID } from 'node:crypto'
import { redisHGet } from "../../lib/redis/hash"
import { pool } from "../../db"
import { redisDel, redisSet } from "../../lib/redis/basic"
import { getRequestEvent } from "solid-js/web"
import { getCookie } from "../../utils"

export const act_on_login_response = async (data) => {
    console.log('device_id: ', data)
    const { request } = getRequestEvent()
    const pf_id = getCookie('pending_verification', request.headers.get('cookie'))
    if (!data) return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 400 })

    try {
        const status = await redisHGet(`temp_device:${data}`, 'status');

        if (!status || status === 'blocked') {
            await redisDel(`verify:email:${pf_id}`)
            await redisDel(`temp_device:${data}`)
            return json({ ok: false, redirectTo: '/login' }, {
                status: 303,
                headers: {
                    'Set-Cookie': 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
                }
            })
        }

        const user_device = await pool.query(`
            SELECT user_id FROM user_devices WHERE id=$1 AND status=$2
        `, [data, status])
        if (!user_device.rowCount) return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 500 })
        const rand_id = randomUUID()

        const user_id = user_device.rows[0].user_id
        const durationSeconds = await redisHGet(`temp_device:${data}`, 'session_expiry');

        const insert_user_session = await redisSet(`user:session:${rand_id}`, JSON.stringify({
            user_id: user_id,
            device_id: data
        }), durationSeconds)

        if (!insert_user_session) return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 500 })

        await redisDel(`verify:email:${pf_id}`)
        await redisDel(`temp_device:${data}`)
        return json({ ok: true, redirectTo: '/dashboard' }, {
            status: 303,
            headers: new Headers([
                ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
            ])
        })
    } catch (error) {
        console.log(error)
        return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 500 })
    }
}