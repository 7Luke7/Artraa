"use server"
import { FormDataValidator } from "../validate/validation-service"
import { createHmac, randomBytes } from "node:crypto"
import { redisDel, redisGet, redisSet } from "../lib/redis/basic"

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
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                a { color: #E85A4F; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <p>თქვენ არ გაქვთ წვდომის უფლება.</p>
            <p><a href="/login">უკან შესვლის გვერდზე</a></p>
        </body>
        </html>
    `, {
        status: 401,
        headers: { 'Content-Type': 'text/html' }
    })
    if (!result.ok) return error_response

    try {
        const user_token_hash = createHmac('sha256', process.env.PASSWORD_RESET_SECRET).update(token).digest('hex')
        const user_id = await redisGet(`verify:email:${user_token_hash}`)
        if (!user_id) return error_response
        
        const sess = randomBytes(32).toString("hex")
        await redisSet(`password:reset:${sess}`, user_id, 600)

        try {await redisDel(`verify:email:${user_token_hash}`)} catch (error) {console.log(error)}
        return new Response(null, { 
            status: 303,
            headers: {
                'Set-Cookie': `reset_session=${sess}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Strict`,
                'Refresh': `0, url=${import.meta.env.VITE_URL}/reset/password`
            }, 
        })
    } catch (error) {
        return error_response
    }
}