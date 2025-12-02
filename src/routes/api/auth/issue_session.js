"use server"
import { redirect } from "@solidjs/router"
import { FormDataValidator } from "../validate/validation-service"
import { createHash } from "node:crypto"
import { pool } from "../db"

export async function GET({ request }) {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    const result = FormDataValidator.validateField('token', token)

    if (!result.ok) return new Response(`
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

    try {
        const user_token_hash = createHash('sha256').update(token).digest('hex')
        const result = await pool.query(`
            SELECT user_id FROM email_verifications WHERE verification_code=$1
        `, [user_token_hash])

        if (!result.rows[0].user_id) return new Response(`
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
        const {user_id} = result.rows[0]
        
        await pool.query(`
            DELETE FROM password_reset_sessions
            WHERE user_id=$1    
        `, [user_id])

        const reset_session = await pool.query(`
            INSERT INTO password_reset_sessions (user_id)
            VALUES($1) RETURNING id
        `, [user_id])

        if (reset_session.rowCount === 0) return new Response(`
            <!DOCTYPE html>
            <html lang="ka">
            <head>
                <meta charset="UTF-8">
                <title>401 არაიდენტიფიცირებული</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                </style>
            </head>
            <body>
                <p>სესიის შენახვა ვერ მოხერხდა, გთხოვთ გადატვირთოთ გვერდი.</p>
            </body>
            </html>
        `, {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        })

        return redirect('/reset/password', { 
            status: 303,
            revalidate: ['protect-reset-password'],
            headers: {
                'Set-Cookie': `reset_session=${user_id}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Strict`
            }, 
        })
    } catch (error) {
        return new Response(`
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
    }
}