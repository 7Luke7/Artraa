'use server'
import { randomUUID } from "node:crypto"
import { exctract_client_info } from "../../utils"

export const verify_email_for = async (verification, client, event) => {
    try {
        switch (verification.verification_type) {
            case 'signup': {
                const { name, email, password_hash, remember_me, salt } = verification
                const create_user = await client.query(`
                    INSERT INTO "User" (name, email, password, email_verified, salt)
                    VALUES($1, $2, $3, true, $4)
                    RETURNING id
                `, [name, email, password_hash, salt])

                if (create_user.rowCount === 0) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const {ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor} = exctract_client_info(event.request, event.clientAddress)
              
                const create_user_device = await client.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [
                    create_user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model
                ])
                if (create_user_device.rowCount === 0) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const durationSeconds = remember_me ? 14 * 86400 : 7 * 86400;
                const durationInterval = remember_me ? '14 days' : '7 days';
                const sessionToken = randomUUID();

                const create_session = await client.query(
                    `INSERT INTO "Session" (session_token, user_id, expires)
                    VALUES ($1, $2, NOW() + $3::interval)`,
                    [sessionToken, create_user.rows[0].id, durationInterval]
                );

                if (create_session.rowCount === 0) return {
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
                        ['Set-Cookie', `auth.session-token=${sessionToken}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
                        ['Set-Cookie', 'pending_verification=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict']
                    ])
                }
            }
            case 'login': {
                const { user_id, remember_me } = verification
                const {ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor} = exctract_client_info(event.request, event.clientAddress)
              
                const create_user_device = await client.query(`
                    INSERT INTO user_devices (
                        user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                        device_type, device_vendor, device_model
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [
                    user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                    device_type, device_vendor, device_model
                ])
                if (create_user_device.rowCount === 0) return {
                    error_message: "ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.",
                    status: 500,
                    ok: false,
                    response_type: 'json'
                }

                const sessionToken = randomUUID();
                const durationSeconds = remember_me ? 14 * 86400 : 7 * 86400;
                const durationInterval = remember_me ? '14 days' : '7 days';

                const create_session = await client.query(
                    `INSERT INTO "Session" (session_token, user_id, expires)
                    VALUES ($1, $2, NOW() + $3::interval)`,
                    [sessionToken, user_id, durationInterval]
                );

                if (create_session.rowCount === 0) return {
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
                        ['Set-Cookie', `auth.session-token=${sessionToken}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Strict`],
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