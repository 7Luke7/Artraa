import { redirect } from "@solidjs/router";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { randomBytes } from "node:crypto"
import { redis } from "../redis";
import { redisHSet } from "../lib/redis/hash";
import { exctract_client_info, get_client_ip } from "../utils";
import { pool } from "../db";

const GOOGLE_ISSUERS = new Set([
    "https://accounts.google.com",
    "accounts.google.com",
]);

const JWKS = createRemoteJWKSet(
    new URL("https://www.googleapis.com/oauth2/v3/certs")
);
async function verifyGoogleIdToken(idToken) {
    try {
        const { payload } = await jwtVerify(idToken, JWKS, {
            audience: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        });

        if (!GOOGLE_ISSUERS.has(payload.iss)) {
            throw new Error("Invalid issuer");
        }

        return payload;
    } catch (error) {
        return null
    }
}

export async function POST({ request }) {
    const form = await request.formData();
    const credential = form.get("credential");
    try {
        if (typeof credential !== "string") return redirect('/login', {
            status: 303,
        });

        const payload = await verifyGoogleIdToken(credential);

        if (!payload || !payload.email || !payload.email_verified) return redirect('/login', {
            status: 303,
        });
        const user = await pool.query(`SELECT id, name FROM "User" WHERE (google_id=$1 OR email=$2)`, [payload.sub, payload.email]);

        if (user.rowCount) {
            const rand_id = randomBytes(32).toString("hex")
            const ip = get_client_ip(request)
            const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(request, ip)

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
                user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                device_type, device_vendor, device_model, device_fingerprint, rand_id
            ])

            if (!create_user_device.rowCount) return redirect('/login', {
                status: 303,
            });

            const durationSeconds = 14 * 86400;

            await redisHSet(`user:session:${rand_id}`, {
                user_id: user.rows[0].id,
                firstname: user.rows[0].name.split(' ')[0],
                pfp: payload.picture,
                device_id: create_user_device.rows[0].id
            })
            await redis.expire(`user:session:${rand_id}`, durationSeconds)
            await redis.sAdd(`user:sessions:${user.rows[0].id}`, rand_id)
            await redis.expire(`user:sessions:${user.rows[0].id}`, 14 * 86400)

            return redirect('/', {
                status: 303,
                revalidate: ['auth', 'get-user-header'],
                headers: {
                    'Set-Cookie': `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Lax`,
                }
            });
        }
        const client = await pool.connect()

        try {
            const create_user = await client.query(`
                INSERT INTO "User" (email, name, google_id, email_verified, profile_picture_link)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `, [payload.email, payload.name, payload.sub, payload.email_verified, payload.picture])

            if (!create_user.rowCount) {
                await client.query('ROLLBACK')
                return redirect('/login', {
                    status: 303,
                });
            }
            const ip = get_client_ip(request)
            const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(request, ip)
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

            if (!create_user_device.rowCount) {
                await client.query('ROLLBACK')
                return redirect('/login', {
                    status: 303,
                });
            }

            const user_device = create_user_device.rows[0]
            const durationSeconds = 14 * 86400;

            await redisHSet(`user:session:${rand_id}`, {
                user_id: create_user.rows[0].id,
                firstname: payload.name.split(' ')[0],
                pfp: payload.picture,
                device_id: user_device.id
            })
            await redis.expire(`user:session:${rand_id}`, durationSeconds)
            await redis.sAdd(`user:sessions:${create_user.rows[0].id}`, rand_id)
            await redis.expire(`user:sessions:${create_user.rows[0].id}`, 14 * 86400)
            await redisHSet(`user:notifications:${create_user.rows[0].id}`, {
                notification_count: 0,
                unseen_notification_count: 0
            })

            client.query('COMMIT')
            return redirect('/', {
                status: 201,
                revalidate: ['auth', 'get-user-header'],
                headers: {
                    'Set-Cookie': `auth.session-token=${rand_id}; Path=/; Max-Age=${durationSeconds}; HttpOnly; Secure; SameSite=Lax`,
                }
            });
        } catch (error) {
            console.log(error)
            client.query('ROLLBACK')
            return redirect('/login', {
                status: 303
            })
        } finally {
            client.release()
        }
    } catch (error) {
        console.log(error)
        return redirect('/login', {
            status: 303
        })
    }
}