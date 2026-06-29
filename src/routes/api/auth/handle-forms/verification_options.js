import { action, json, redirect } from "@solidjs/router"
import { exctract_client_info, retreiveCookie, send_verification_code } from "../../utils"
import { redisHGet, redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"
import { getRequestEvent } from "solid-js/web"
import { createHmac, randomInt } from "node:crypto"
import { notify_user_new_device } from "~/server/utils"
import { pool } from "../../db"

export const approve_with_email = action(async (next_page) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get('cookie')

    try {
        if (!cookie) throw redirect('/login')
        const pending_verification_id = retreiveCookie('pending_verification', cookie)

        if (!pending_verification_id) throw redirect('/login')
        const email = await redisHGet(`pending:verification:${pending_verification_id}`, 'email')

        if (!email) throw redirect('/login')

        const verification_code = randomInt(100000, 1000000).toString()
        const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
        await redisHSet(`pending:verification:${pending_verification_id}`, { code: hashed_verification_code })
        await redis.expire(`pending:verification:${pending_verification_id}`, 900)

        try { await send_verification_code(email, verification_code) } catch (e) { }

        throw redirect(!next_page ? '/verify/email' : `/verify/email${next_page}`, {
            status: 303,
            headers: {
                'Set-Cookie': `pending_verification=${pending_verification_id}; Path=/; Max-Age=900; HttpOnly; Secure; SameSite=Strict`
            }
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error
    }
}, 'verify-approve-email')

export const approve_with_device = action(async (next_page) => {
    'use server'
    const event = getRequestEvent()
    const cookie = event.request.headers.get('cookie')
    try {
        if (!cookie) throw redirect('/login')
        const pending_verification_id = retreiveCookie('pending_verification', cookie)

        if (!pending_verification_id) throw redirect('/login')
        const email = await redisHGet(`pending:verification:${pending_verification_id}`, 'email')
        const user_id = await redisHGet(`pending:verification:${pending_verification_id}`, 'user_id')

        if (!email || !user_id) throw redirect('/login')

        const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(event.request, event.clientAddress)

        const create_user_device = await pool.query(`
            INSERT INTO user_devices (
                user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                device_type, device_vendor, device_model, device_fingerprint, status, pending_verification_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', $12)    
            ON CONFLICT(user_id, device_fingerprint)
            DO UPDATE 
            SET user_agent=EXCLUDED.user_agent,
                ip_address=EXCLUDED.ip_address,
                browser=EXCLUDED.browser,
                browser_version=EXCLUDED.browser_version,
                os=EXCLUDED.os, 
                os_version=EXCLUDED.os_version,
                last_used=NOW(),
                device_type=EXCLUDED.device_type,
                device_vendor=EXCLUDED.device_vendor,
                device_model=EXCLUDED.device_model,
                status='pending',
                pending_verification_id=EXCLUDED.pending_verification_id
            RETURNING id
        `, [
            user_id, user_agent, ip_address, browser, browser_version, os, os_version,
            device_type, device_vendor, device_model, device_fingerprint, pending_verification_id
        ])

        if (!create_user_device.rowCount) return json({
            message: "დაფიქსირდა შეცდომა, სცადეთ ხელახლა.",
            ok: false,
        }, { status: 500 })

        const user_device = create_user_device.rows[0]

        const title = "ახალი შესვლის მცდელობა";
        const description = `
            მოწყობილობა: ${device_type || 'უცნობი'}
            Vendor: ${device_vendor || 'უცნობი'}
            მოდელი: ${device_model || 'უცნობი'}
            OS: ${os} ${os_version}
            Browser: ${browser} ${browser_version}
            IP მისამართი: ${event.clientAddress}
        `;

        try {
            const add_notif = await pool.query(`
                    INSERT INTO notifications (user_id, title, description, notif_type)
                    VALUES ($1, $2, $3, $4)
                `, [
                user_id,
                title,
                description,
                'უსაფრთხოება'
            ])
            if (add_notif.rowCount) {
                await redis.hIncrBy(`user:notifications:${user_id}`, 'notification_count', 1)
                await redis.hIncrBy(`user:notifications:${user_id}`, 'unseen_notification_count', 1)
            }
        } catch (error) { }
        await redisHSet(`pending:verification:${pending_verification_id}`, {
            device_id: user_device.id,
            status: 'pending',
            browser,
            user_agent,
            ip_address: event.clientAddress,
            browser_version,
            os,
            os_version,
            device_type, device_model, device_vendor
        })
        await redis.expire(`pending:verification:${pending_verification_id}`, 900)

        await notify_user_new_device(user_id, {
            type: 'new-device-login-request',
            pending_verification_id
        })
        throw redirect(!next_page ? '/verify/await' : `/verify/await${next_page}`)
    } catch (error) {
        if (error instanceof Response) throw error
    }
}, 'verify-approve-device')