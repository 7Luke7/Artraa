import { action, json } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../../utils";
import { pool } from "../../db";
import { FormDataValidator } from "../../validate/validation-service";

export const resetPasswordAction = action(async (formData) => {
    'use server'
    const {request} = getRequestEvent()
    const cookie = request.headers.get('cookie')
    const {პაროლი: password, დაადასტურე_პაროლი: confirm_password} = FormDataValidator.validateInput(formData)

    if (password !== confirm_password) return json({message: 'პაროლები ერთმანეთს არ ემთხვევა'}, {status: 400})
    if (!cookie) return json({message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.'}, {status: 401})
    const rs = getCookie('reset_session', cookie)
    if (!rs) return json({message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.'}, {status: 401})
    try {
        const reset_session = await pool.query(`
            SELECT user_id FROM password_reset_sessions
            WHERE id=$1
        `, [rs])

        if (reset_session.rowCount === 0) return json({message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.'}, {status: 401})

        const salt = randomBytes(16); 
        const parameters = {
            message: password,
            nonce: salt,
            parallelism: 1,
            tagLength: 32,
            memory: 32768,  // 32 MiB
            passes: 2,
            secret: process.env.ARGON_SECRET
        };

        const hash_result = await hash_password(parameters)
        if (!hash_result.ok) throw new Error(hash_result.err)
        const change_password = await pool.query(`
            UPDATE "User"
            SET password = $2,
                salt = $3
            WHERE id = $1
        `, [reset_session.rows[0].user_id, hash_result, salt])

        if (change_password.rowCount === 0) return json({message: 'პაროლი წარმატებით განახლდა.'}, {status: 200})
        throw redirect('/login', { 
            status: 303,
            headers: {
                'Set-Cookie': `reset_session=; Max-Age=600; HttpOnly; Secure; SameSite=Strict`
            } 
        })
    } catch (error) {
        if (error instanceof Response) throw error
        console.log(error)
        return json({ message: 'პაროლის აღდგენა შეცდომით დასრულდა, სცადეთ ხელახლა.' }, {
            status: 500
        })
    }
}, 'reset-password')