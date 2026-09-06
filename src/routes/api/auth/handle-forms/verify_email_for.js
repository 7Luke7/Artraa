"use server"
import { exctract_client_info } from "../../utils"
import { randomBytes } from "node:crypto"
import { redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"
import { pool } from "../../db"
import { logError } from "../../lib/log"

export const verify_email_for = async (verification, event) => {
    switch (verification.type) {
        case 'signup': {
            const client = await pool.connect()
            const { name, email, password, remember_me, salt } = verification
            try {
                await client.query('BEGIN')
                const create_user = await client.query(`
                    INSERT INTO "User" (name, email, password, email_verified, salt)
                    VALUES($1, $2, $3, true, $4)
                    RETURNING id
                `, [name, email, password, salt])

                if (!create_user.rowCount) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(event.request, event.clientAddress)
                const rand_id = randomBytes(32).toString("hex")

                const create_user_device = await client.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model, device_fingerprint, session_id
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id
                `, [
                    create_user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model, device_fingerprint, rand_id
                ])

                if (!create_user_device.rowCount) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const user_device = create_user_device.rows[0]
                const durationSeconds = remember_me === "1" ? 14 * 86400 : 7 * 86400;

                await redisHSet(`user:session:${rand_id}`, {
                    user_id: create_user.rows[0].id,
                    firstname: name.split(' ')[0],
                    device_id: user_device.id
                })
                await redis.expire(`user:session:${rand_id}`, durationSeconds)
                await redis.sAdd(`user:sessions:${create_user.rows[0].id}`, rand_id)
                await redis.expire(`user:sessions:${create_user.rows[0].id}`, 14 * 86400)
                await redisHSet(`user:notifications:${create_user.rows[0].id}`, {
                    notification_count: 0,
                    unseen_notification_count: 0
                })

                await client.query('COMMIT')
                return {
                    response_type: 'redirect',
                    status: 201,
                    ok: true,
                    location: '/',
                    headers: new Headers([
                        ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                        ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
                    ])
                }
            } catch (error) {
                logError("auth/handle-forms/verify_email_for", error)
                await client.query('ROLLBACK')
                return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }
            } finally {
                client.release()
            }
        }
        case 'login': {
            const { user_id, name, remember_me } = verification
            const rand_id = randomBytes(32).toString("hex")

            const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(event.request, event.clientAddress)
            try {
                const create_user_device = await pool.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model, device_fingerprint, session_id
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)    
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
                        session_id=EXCLUDED.session_id,
                        status='trusted'
                    RETURNING id
                `, [
                    user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model, device_fingerprint, rand_id
                ])

                if (!create_user_device.rowCount) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const user_device = create_user_device.rows[0]
                const durationSeconds = remember_me === "1" ? 14 * 86400 : 7 * 86400;

                const title = "ახალი შესვლა";
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
                await redisHSet(`user:session:${rand_id}`, {
                    user_id,
                    firstname: name,
                    device_id: user_device.id
                })
                await redis.expire(`user:session:${rand_id}`, durationSeconds)
                await redis.sAdd(`user:sessions:${user_id}`, rand_id)
                await redis.expire(`user:sessions:${user_id}`, 14 * 86400)

                return {
                    response_type: 'redirect',
                    status: 201,
                    ok: true,
                    location: '/',
                    headers: [
                        ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Lax`],
                        ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
                    ]
                }
            } catch (error) {
                logError("auth/handle-forms/verify_email_for", error)
                return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }
            }
        }
        default:
            return {
                status: 500,
                error_message: 'ვერიფიკაცია ვერ მოხერხდება.',
                ok: false,
                response_type: 'json'
            }
    }
}