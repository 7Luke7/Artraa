'use server'
import { oauth_session } from "../sessions";
import * as jose from "jose"
import { pool } from "../../db";
import { exctract_client_info, get_client_ip } from "../../utils";
import { randomUUID } from "node:crypto"
import { redisSet } from "../../lib/redis/basic";

export async function GET({ request }) {
    const session = await oauth_session()
    const csrf = session.data.csrf
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    const decoded = JSON.parse(
        Buffer.from(
            state.replace(/-/g, '+').replace(/_/g, '/').padEnd(state.length + (4 - state.length % 4) % 4, '='),
            'base64'
        ).toString()
    );

    try {
        if (error) {
            await session.clear()
            return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
        }
        if (!code || !state) {
            await session.clear()
            return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
        }

        if (decoded.csrf === csrf) {
            const token_response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: `${import.meta.env.VITE_URL}/api/auth/callback/google`,
                    grant_type: "authorization_code",
                }),
            })

            const tokens = await token_response.json();

            if (!token_response.ok || !tokens.id_token) {
                await session.clear()
                return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
            } else {
                const jwks = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
                const { payload } = await jose.jwtVerify(tokens.id_token, jwks, {
                    issuer: 'https://accounts.google.com',
                    audience: process.env.GOOGLE_CLIENT_ID,
                });

                const client = await pool.connect()
                try {
                    await client.query('BEGIN')
                    const user = await client.query(`SELECT id FROM "User" WHERE (google_id=$1 OR email=$2)`, [payload.sub, payload.email]);

                    if (user.rowCount === 1) {
                        await session.clear()
                        const ip = get_client_ip(request)
                        const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(request, ip)

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
                        `, [
                            user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                            device_type, device_vendor, device_model, device_fingerprint
                        ])

                        if (!create_user_device.rowCount) {
                            await client.query('ROLLBACK')
                            return new Response(`
                                <script>
                                    window.opener.postMessage({ success: false }, window.origin);
                                    window.close();
                                </script>
                            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                        }

                        const durationSeconds = 14 * 86400
                        const rand_id = randomUUID()

                        const create_session = await redisSet(`user:session:${rand_id}`, JSON.stringify({
                            user_id: user.rows[0].id,
                            device_id: create_user_device.rows[0].id
                        }), durationSeconds)

                        if (!create_session) {
                            await client.query('ROLLBACK')
                            return new Response(`
                                <script>
                                    window.opener.postMessage({ success: false }, window.origin);
                                    window.close();
                                </script>
                            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                        }

                        await client.query('COMMIT')
                        return new Response(`
                                <script>
                                    window.opener.postMessage({ success: true }, window.origin);
                                    window.close();
                                </script>
                            `, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Set-Cookie': [
                                    `auth.session-token=${rand_id}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${durationSeconds}`,
                                    'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure',
                                ],
                            }
                        });
                    }

                    const create_user = await client.query(`
                        INSERT INTO "User" (email, name, google_id, email_verified, profile_picture_link)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id
                    `, [payload.email, payload.name, payload.sub, payload.email_verified, payload.picture])

                    if (!create_user.rowCount) {
                        await client.query('ROLLBACK')
                        await session.clear()
                        return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                    } else {
                        await session.clear()
                        const ip = get_client_ip(request)
                        const { ip_address, user_agent, browser, browser_version, os, os_version, device_type, device_model, device_vendor, device_fingerprint } = exctract_client_info(request, ip)

                        const create_user_device = await client.query(`
                            INSERT INTO user_devices (
                                user_id, user_agent, ip_address, browser, browser_version, os, os_version,
                                device_type, device_vendor, device_model, device_fingerprint
                            )
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
                        `, [
                            user.rows[0].id, user_agent, ip_address, browser, browser_version, os, os_version,
                            device_type, device_vendor, device_model, device_fingerprint
                        ])

                        if (!create_user_device.rowCount) {
                            await client.query('ROLLBACK')
                            return new Response(`
                                <script>
                                    window.opener.postMessage({ success: false }, window.origin);
                                    window.close();
                                </script>
                            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                        }

                        const durationSeconds = 14 * 86400
                        const rand_id = randomUUID()

                        const create_session = await redisSet(`user:session:${rand_id}`, JSON.stringify({
                            user_id: create_user.rows[0].id,
                            device_id: create_user_device.rows[0].id
                        }), durationSeconds)

                        if (!create_session) {
                            await client.query('ROLLBACK')
                            return new Response(`
                                <script>
                                    window.opener.postMessage({ success: false }, window.origin);
                                    window.close();
                                </script>
                            `, {
                                status: 401,
                                headers: {
                                    'Content-Type': 'text/html',
                                    'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure'
                                }
                            });
                        }

                        await client.query('COMMIT')
                        return new Response(`
                                <script>
                                    window.opener.postMessage({ success: true }, window.origin);
                                    window.close();
                                </script>
                            `, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Set-Cookie': [
                                    `auth.session-token=${rand_id}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${durationSeconds}`,
                                    'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure'
                                ],
                            }
                        });
                    }
                } catch (error) {
                    console.log(error)
                    await client.query('ROLLBACK')
                    return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                } finally {
                    client.release()
                }
            }
        } else {
            await session.clear()
            return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
        }
    } catch (error) {
        console.log(error)
        await session.clear()
        return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 500, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
    }
}
