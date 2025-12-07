'use server'
import { notify_user_new_device } from "~/server/utils"
import { redisSet } from "../../lib/redis/basic"
import { exctract_client_info } from "../../utils"
import { randomUUID } from "node:crypto"
import { redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"

export const verify_email_for = async (verification, client, event) => {
    try {
        switch (verification.type) {
            case 'signup': {
                const { name, email, password, remember_me, salt } = verification
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

                const create_user_device = await client.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model, device_fingerprint, status
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active') RETURNING id
                `, [
                    create_user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model, device_fingerprint
                ])
                if (!create_user_device.rowCount) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const durationSeconds = remember_me === "1" ? 14 * 86400 : 7 * 86400;
                const rand_id = randomUUID()

                const insert_user_session = await redisSet(`user:session:${rand_id}`, JSON.stringify({
                    user_id: create_user.id,
                    device_id: create_user_device.id
                }), durationSeconds)

                if (!insert_user_session) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                return {
                    response_type: 'redirect',
                    status: 303,
                    ok: true,
                    location: '/dashboard',
                    headers: new Headers([
                        ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                        ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
                    ])
                }
            }
            case 'login': {
                const { user_id, remember_me } = verification
                const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(event.request, event.clientAddress)

                const create_user_device = await client.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model, device_fingerprint, status
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active')
                    ON CONFLICT (user_id, device_fingerprint)
                    DO UPDATE
                    SET 
                        user_agent=$2, ip_address=$3, browser=$4, browser_version=$5,
                        os=$6, os_version=$7, device_type=$8, device_vendor=$9, device_model=$10,
                        device_fingerprint=$11, last_used=NOW(), status='active'
                    WHERE user_devices.status != 'blocked'
                    RETURNING id, xmax;
                `, [
                    user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model, device_fingerprint
                ])
                if (!create_user_device.rowCount) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }
                
                const is_new_device = create_user_device.rows[0].xmax === 0;
                if (true) {
                    await redisHSet(`temp_device:${create_user_device.rows[0].id}`, {
                        ip_address,
                        user_agent,
                        browser,
                        browser_version,
                        os,
                        os_version,
                        device_type,
                        device_model,
                        device_vendor,
                        status: 'pending',
                        session_expiry: remember_me === "1" ? 14 * 86400 : 7 * 86400,
                    })
                    await redis.expire(`temp_device:${create_user_device.rows[0].id}`, 300)
                    await notify_user_new_device(user_id, {
                        type: 'new-device-login-request',
                        temp_device_id: create_user_device.rows[0].id
                    })

                    return { ok: true, waiting_for_approval: true, device_id: create_user_device.rows[0].id }
                }
                const durationSeconds = remember_me === "1" ? 14 * 86400 : 7 * 86400;
                const rand_id = randomUUID()

                const insert_user_session = await redisSet(`user:session:${rand_id}`, JSON.stringify({
                    user_id: user_id,
                    device_id: create_user_device.rows[0].id
                }), durationSeconds)

                if (!insert_user_session) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }
                return {
                    response_type: 'redirect',
                    status: 303,
                    ok: true,
                    location: '/dashboard',
                    headers: new Headers([
                        ['Set-Cookie', `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                        ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
                    ])
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
    } catch (error) {
        console.log(error)
        return {
            error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
            status: 500,
            ok: false,
            response_type: 'json'
        }
    }
}