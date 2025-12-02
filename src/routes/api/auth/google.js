'use server'
import { redirect } from "@solidjs/router"
import { oauth_session } from "./sessions"
import { randomUUID } from 'node:crypto'

export async function GET() {
    const session = await oauth_session()
    try {
        await session.update({
            csrf: randomUUID(),
        })
        const query_parameters = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: `${import.meta.env.VITE_URL}/api/auth/callback/google`,
            response_type: 'code',
            scope: "openid email profile",
            prompt: 'consent',
            access_type: 'online',
            state: btoa(JSON.stringify(session.data))
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        })
        return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${query_parameters.toString()}`)
    } catch (error) {
        await session.clear()
        return new Response(`
            <script>
                window.opener.postMessage({ success: false }, window.origin);
                window.close();
            </script>
    `, { headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure' } });
    }
}
