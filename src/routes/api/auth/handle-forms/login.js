import { action, json, redirect } from "@solidjs/router"
import { pool } from "../../db"
import { FormDataValidator } from "../../validate/validation-service"
import { randomBytes } from "node:crypto"
import { hash_password } from "../hash"
import { redis } from "../../redis"
import { redisHSet } from "../../lib/redis/hash"
import { exctract_client_info } from "../../utils"
import { getRequestEvent } from "solid-js/web"

export const login = action(async (formData) => {
    "use server"
    const next_page = formData.get('next_page')
    formData.delete('next_page')
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ message: validation_result.message, field: validation_result.field }, {
        status: 400
    })
    const { email, password, remember_me } = validation_result.data

    const event = getRequestEvent()

    try {
        const {device_fingerprint} = exctract_client_info(event.request, event.clientAddress)
        const res = await pool.query(`
            SELECT name, salt, password, id 
            FROM "User" u
            WHERE email = $1 AND NOT EXISTS (
                SELECT 1
                FROM user_devices ud
                WHERE ud.user_id = u.id
                AND ud.device_fingerprint = $2
                AND ud.status = 'blocked'
            )
        `, [email, device_fingerprint]);

        if (!res.rowCount) return json({ field: 'global', message: 'არასწორი მონაცემები, სცადეთ ხელახლა.' }, {
            status: 400
        })
        const user = res.rows[0];

        if (!user.password) return json({ field: 'global', message: 'პაროლი არ არსებობს.' }, {
            status: 400
        })

        const parameters = {
            message: password,
            nonce: Buffer.from(user.salt, 'hex'),
            parallelism: 1,
            tagLength: 32,
            memory: 32768,  // 32 MiB
            passes: 2,
            secret: process.env.ARGON_SECRET
        };

        const user_hash_key = await hash_password(parameters)
        if (!user_hash_key.ok) return json({
            field: 'global', message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        if (user.password !== user_hash_key.key) return json({ field: 'password', message: 'პაროლი არასწორია.' }, {
            status: 400
        })

        const rand_id = randomBytes(32).toString("hex")
        await redisHSet(`pending:verification:${rand_id}`, {
            remember_me: remember_me ? '1' : '0',
            type: 'login',
            email,
            name: user.name.split(' ')[0],
            user_id: user.id,
        })
        await redis.expire(`pending:verification:${rand_id}`, 900)

        throw redirect(!next_page ? "/verify/pending" : `/verify/pending${next_page}`, {
            status: 303,
            headers: {
                'Set-Cookie': `pending_verification=${rand_id}; Path=/; Max-Age=900; HttpOnly; Secure; SameSite=Strict`,
            }
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error;
        return json({
            field: 'global', message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
    }
}, 'login-handler')