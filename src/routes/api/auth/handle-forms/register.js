import { action, json, redirect } from "@solidjs/router"
import { FormDataValidator } from "../../validate/validation-service"
import { pool } from "../../db"
import { send_verification_code } from "../../utils"
import { createHmac, randomBytes, randomInt } from "node:crypto"
import { hash_password } from "../hash"
import { redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"

export const register = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ message: validation_result.message, field: validation_result.field }, {
        status: 400
    })

    const { given_name, family_name, email, password, remember_me } = validation_result.data

    try {
        const user = await pool.query(`
            SELECT EXISTS(SELECT 1 FROM "User" WHERE email=$1)
            `, [email])

        if (user.rows[0].exists) return json({
            message: "არასწორი ინფორმაცია, სცადეთ ხელახლა.",
            field: 'global'
        }, {
            status: 400
        })

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
        const verification_code = randomInt(100000, 1000000).toString();
        const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
        const rand_id = randomBytes(32).toString("hex")

        await redisHSet(`pending:verification:${rand_id}`, {
            name: given_name + ' ' + family_name,
            email,
            password: hash_result.key,
            remember_me: remember_me ? '1' : '0',
            type: 'signup',
            code: hashed_verification_code,
            salt: salt.toString('hex')
        })
        await redis.expire(`pending:verification:${rand_id}`, 900)

        try { await send_verification_code(email, verification_code) } catch (e) { }

        throw redirect('/verify/email', {
            status: 303,
            headers: {
                'Set-Cookie': `pending_verification=${rand_id}; Path=/; Max-Age=900; HttpOnly; Secure; SameSite=Strict`,
            }
        })
    } catch (error) {
        if (error instanceof Response) throw error
        if (error.code === '23505') return json({
            message: 'დაფიქსირდა არასწორი მონაცემები, სცადეთ ხელახლა.',
            field: 'global' 
        }, {
            status: 400
        })
        return json({
            message: 'რეგისტრაცია შეცდომით დასრულდა, სცადეთ ხელახლა.',
            field: 'global'
         }, {
            status: 500
        })
    }
}, 'register-handler')