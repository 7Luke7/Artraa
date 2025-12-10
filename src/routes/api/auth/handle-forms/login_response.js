'use server'

import { json } from "@solidjs/router"
import { randomBytes } from 'node:crypto'
import { redisHGet, redisHSet } from "../../lib/redis/hash"
import { pool } from "../../db"
import { redisDel } from "../../lib/redis/basic"
import { getRequestEvent } from "solid-js/web"
import { getCookie } from "../../utils"
import { redis } from "../../redis"

export const act_on_login_response = async (data) => {
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
            SELECT 
                u.user_id AS user_id,
                u.name AS name
            FROM "User" u
            INNER JOIN user_devices ud ON ud.user_id = u.user_id
            WHERE ud.id=$1 AND ud.status=$2
        `, [data, status])
        if (!user_device.rowCount) return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 500 })
        const rand_id = randomBytes(32).toString("hex")

        const user_id = user_device.rows[0].user_id
        const durationSeconds = await redisHGet(`temp_device:${data}`, 'session_expiry');

        await redisHSet(`user:session:${rand_id}`, {
            user_id: user_id,
            name: user_device.rows[0].name,
            device_id: data
        })
        await redis.expire(`user:session:${rand_id}`, durationSeconds)

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