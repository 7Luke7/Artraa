import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../../utils";
import { pool } from "../../db";
import { FormDataValidator } from "../../validate/validation-service";
import { randomBytes } from "node:crypto";
import { hash_password } from "../hash";
import { redisDel, redisGet } from "../../lib/redis/basic";

export const resetPasswordAction = action(async (formData) => {
    'use server'
    const {request} = getRequestEvent()
    const cookie = request.headers.get('cookie')
    if (!cookie) return json({message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.'}, {status: 401})
    const rs = getCookie('reset_session', cookie)
    if (!rs) return json({message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.'}, {status: 401})

    const result = FormDataValidator.validateInput(formData)
    if (!result.ok) return json({message: result.error_message}, {status: 400})
    const {პაროლი: password, 'დაადასტურე პაროლი': confirm_password} = result.data
    if (password !== confirm_password) return json({message: 'პაროლები ერთმანეთს არ ემთხვევა'}, {status: 400})
    
    try {
        const user_id = await redisGet(`password:reset:${rs}`)
        if (!user_id) return json({message: 'სესიის დრო ამოიწურა.'}, {status: 401})

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
        `, [user_id, hash_result.key, salt.toString('hex')])

        if (!change_password.rowCount) return json({message: 'პაროლი ვერ განახლდა, სცადეთ ხელახლა'}, {status: 400})
        try {await redisDel(`password:reset:${rs}`)} catch (error) {console.log(error)}
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