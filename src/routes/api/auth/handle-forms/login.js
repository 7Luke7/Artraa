import { action, json, redirect } from "@solidjs/router"
import { pool } from "../../db"
import { FormDataValidator } from "../../validate/validation-service"
import { send_verification_code } from "../../utils"
import { randomInt, createHmac } from "node:crypto"
import { hash_password } from "../hash"

export const login = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ error_message: validation_result.error_message }, {
        status: 400
    })
    const { მეილი: email, პაროლი: password, დამიმახსოვრე: remember_me } = validation_result.data

    try {
        const res = await pool.query(`SELECT salt, password, id FROM "User" WHERE email = $1`, [email]);

        if (res.rowCount === 0) return json({ error_message: 'არასწორი მონაცემები, სცადეთ ხელახლა.' }, {
            status: 400
        })
        const user = res.rows[0];

        if (!user.password) return json({ error_message: 'პაროლი არ არსებობს.' }, {
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
            error_message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        if (user.password !== user_hash_key.key) return json({ error_message: 'პაროლი არასწორია.' }, {
            status: 400
        })
        const verification_code = randomInt(100000, 1000000).toString();
        const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
        
        const verification = await pool.query(`
            INSERT INTO email_verifications (verification_code, remember_me, verification_type, user_id)
            VALUES ($1, $2, 'login', $3) RETURNING id  
        `, [hashed_verification_code, remember_me, res.rows[0].id])

        if (verification.rowCount === 0) return json({
            error_message: "დაფიქსირდა შეცდომა კოდის გაგზავნისას, სცადეთ ხელახლა."
        }, {
            status: 500
        })
        
        try { await send_verification_code(email, verification_code) } catch (e) {}

        throw redirect("/verify", {
            status: 303,
            headers: {
              'Set-Cookie': `pending_verification=${verification.rows[0].id}; Path=/; Max-Age=1800; HttpOnly; Secure; SameSite=Strict`
            } 
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error;
        return json({
            error_message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
    }
}, 'login-handler')