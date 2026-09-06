"use server"
import { FormDataValidator } from "../validate/validation-service"
import { createHmac, randomBytes } from "node:crypto"
import { redisDel, redisGet, redisSet } from "../lib/redis/basic"
import { logError } from "../lib/log"

export async function GET({ request }) {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    const result = FormDataValidator.validateField('token', token)

    const error_response = new Response(`
        <!DOCTYPE html>
        <html lang="ka">
        <head>
            <meta charset="UTF-8">
            <title>401 არაიდენტიფიცირებული</title>
            <style>
                body { text-align: center; padding: 50px; }
                a { color: #E85A4F; text-decoration: none; }
            </style>
        </head>
        <body>
            <p class='font-gsans font-normal'>თქვენ არ გაქვთ წვდომის უფლება.</p>
            <p><a href="/login" class='font-gsans font-bold' target='_self'>უკან შესვლის გვერდზე</a></p>
        </body>
        </html>
    `, {
        status: 401,
        headers: { 'Content-Type': 'text/html', 'Cache-control': 'no-store' }
    })
    if (!result.ok) return error_response

    try {
        const user_token_hash = createHmac('sha256', process.env.PASSWORD_RESET_SECRET).update(token).digest('hex')
        const user_id = await redisGet(`pending:verification:${user_token_hash}`)
        if (!user_id) return error_response
        
        const sess = randomBytes(32).toString("hex")
        await redisSet(`password:reset:${sess}`, user_id, 900)

        try {await redisDel(`pending:verification:${user_token_hash}`)} catch (error) {logError("auth/issue_session", error)}
        return new Response(null, { 
            status: 303,
            headers: {
                'Set-Cookie': `reset_session=${sess}; Path=/; Max-Age=900; HttpOnly; Secure; SameSite=Strict`,
                'Refresh': `0, url=${import.meta.env.VITE_URL}/reset/password`
            }, 
        })
    } catch (error) {
        return error_response
    }
}