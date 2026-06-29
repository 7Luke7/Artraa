import { json, query } from "@solidjs/router"
import { randomBytes } from 'node:crypto'
import { redisHGet, redisHSet } from "../../lib/redis/hash"
import { pool } from "../../db"
import { redisDel } from "../../lib/redis/basic"
import { getRequestEvent } from "solid-js/web"
import { retreiveCookie } from "../../utils"
import { redis } from "../../redis"
import { FormDataValidator } from "../../validate/validation-service"

export const act_on_login_response = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookies = request.headers.get('cookie')
    const next_page = new URL(request.url).searchParams.get("next")

    if (!cookies) return json({ ok: false }, {
        status: 401,
        headers: {
            'Set-Cookie': 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
        }
    })

    const pending = retreiveCookie('pending_verification', cookies)
    if (!pending) return json({ ok: false }, {
        status: 401,
        headers: {
            'Set-Cookie': 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
        }
    })

    const validate_verification_id = FormDataValidator.validateField('vid', pending)

    if (!validate_verification_id.ok) return json({ ok: false }, {
        status: 401,
        headers: {
            'Set-Cookie': 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
        }
    })

    const { value: vid } = validate_verification_id
    try {
        const status = await redisHGet(`pending:verification:${vid}`, 'status');

        if (!status || status === 'blocked') {
            await redisDel(`pending:verification:${vid}`)
            return json({ ok: false }, {
                status: 401,
                headers: {
                    'Set-Cookie': 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'
                }
            })
        }

        if (status === 'pending') return json({ ok: false, pending: true }, { status: 200 })

        const device_id = await redisHGet(`pending:verification:${vid}`, 'device_id');
        if (!device_id) return json({ok: false}, {status: 401})
        const user_id = await redisHGet(`pending:verification:${vid}`, 'user_id');
        if (!user_id) return json({ok: false}, {status: 401})
        const rand_id = randomBytes(32).toString("hex")
        const name = await redisHGet(`pending:verification:${vid}`, 'name');
        if (!name) return json({ok: false}, {status: 401})
        const remember_me = await redisHGet(`pending:verification:${vid}`, 'remember_me');
        const durationSeconds = remember_me === "1" ? 14 * 86400 : 7 * 86400;

        await pool.query(`
            UPDATE user_devices
            SET session_id=$3
            WHERE user_id = $1 AND id = $2
        `, [user_id, device_id, rand_id])
        await redisHSet(`user:session:${rand_id}`, {
            user_id: user_id,
            firstname: name.split(' ')[0],
            device_id: device_id
        })
        await redis.expire(`user:session:${rand_id}`, durationSeconds)

        await redis.sAdd(`user:sessions:${user_id}`, rand_id)
        await redis.expire(`user:sessions:${user_id}`, 14 * 86400)
        await redisDel(`pending:verification:${vid}`)
        return json({ ok: true, next_page: next_page || null }, {
            status: 200,
            headers: new Headers([
                ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'],
            ]),
        })
    } catch (error) {
        return json({ message: 'დაფიქსირდა შეცდომა.', ok: false }, { status: 500 })
    }
}, 'act-on-login-response')