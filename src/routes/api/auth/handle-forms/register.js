import { action, json, redirect } from "@solidjs/router"
import { FormDataValidator } from "../../validate/validation-service"
import { pool } from "../../db"
import { send_verification_code } from "../../utils"
import { createHmac,randomBytes, randomInt, randomUUID } from "node:crypto"
import { hash_password } from "../hash"
import { redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"

export const register = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ error_message: validation_result.error_message }, {
        status: 400
    })

    const { სახელი: firstname, გვარი: lastname, მეილი: email, პაროლი: password, დამიმახსოვრე: remember_me } = validation_result.data

    try {
        const user = await pool.query(`
            SELECT EXISTS(SELECT 1 FROM "User" WHERE email=$1)
            `, [email])

        if (user.rows[0].exists) return json({
            error_message: "არასწორი ინფორმაცია, სცადეთ ხელახლა."
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
        const rand_id = randomUUID()                
        
        const set_verify = await redisHSet(`verify:email:${rand_id}`, {
            name: firstname + ' ' + lastname, 
            email, 
            password: hash_result.key, 
            remember_me: remember_me ? '1' : '0',
            type: 'signup',
            code: hashed_verification_code, 
            salt: salt.toString('hex')
        })
        if (!set_verify) return json({
            error_message: 'ვერიფიკაციის კოდის გაგზავნა ვერ მოხერხდა, სცადეთ ხელახლა.'
        }, {
            status: 400
        })

        const set_expire = await redis.expire(`verify:email:${rand_id}`, 600)
        if (!set_expire) return json({
            error_message: 'ვერიფიკაციის კოდის გაგზავნა ვერ მოხერხდა, სცადეთ ხელახლა.'
        }, {
            status: 400
        })


        try { await send_verification_code(email, verification_code) } catch (e) { }

        throw redirect('/verify', {
            status: 303,
            headers: {
                'Set-Cookie': `pending_verification=${rand_id}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Strict`
            }
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error
        if (error.code === '23505') return json({ error_message: 'დაფიქსირდა არასწორი მონაცემები, სცადეთ ხელახლა.' }, {
            status: 400
        })
        return json({ error_message: 'რეგისტრაცია შეცდომით დასრულდა, სცადეთ ხელახლა.' }, {
            status: 500
        })
    }
}, 'register-handler')