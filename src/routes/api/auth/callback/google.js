'use server'
import { oauth_session } from "../sessions";
import * as jose from "jose"
import { pool } from "../../db";
import { randomUUID } from "node:crypto"

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
                        const sessionToken = randomUUID();
                        await session.clear()
                        const durationSeconds = 14 * 86400
                        const durationInterval = '14 days'

                        const create_session = await client.query(`
                            INSERT INTO "Session" (session_token, user_id, expires)
                            VALUES ($1, $2, NOW() AT TIME ZONE 'UTC' + $3::interval)
                        `, [sessionToken, user.rows[0].id, durationInterval])

                        if (create_session.rowCount === 0) {
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
                                    `auth.session-token=${sessionToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${durationSeconds}`,
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

                    if (create_user.rowCount === 0) {
                        await client.query('ROLLBACK')
                        await session.clear()
                        return new Response(`
                <script>
                    window.opener.postMessage({ success: false }, window.origin);
                    window.close();
                </script>
            `, { status: 401, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
                    } else {
                        const sessionToken = randomUUID();
                        await session.clear()
                        const durationSeconds = 14 * 86400
                        const durationInterval = '14 days'

                        const create_session = await client.query(`
                            INSERT INTO "Session" (session_token, user_id, expires)
                            VALUES ($1, $2, NOW() AT TIME ZONE 'UTC' + $3::interval)
                        `, [sessionToken, create_user.rows[0].id, durationInterval])

                        if (create_session.rowCount === 0) {
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
                                    `auth.session-token=${sessionToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=${durationSeconds}`,
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
