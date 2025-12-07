import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { FormDataValidator } from "../../validate/validation-service";
import { pool } from "../../db";
import { verify_email_for } from "./verify_email_for";
import { getCookie } from "../../utils";
import {createHmac} from "node:crypto"
import { redisHGetAll } from "../../lib/redis/hash";
import { redisDel } from "../../lib/redis/basic";

export const verify_email_action = action(async (formData) => {
    "use server"
    const event = getRequestEvent()
    const cookies = event.request.headers.get('cookie')

    if (!cookies) return json({ error_message: "არასწორი მონაცემები." }, { status: 401 })

    const pending = getCookie('pending_verification', cookies)
    if (!pending) return json({ error_message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 400 })

    const result = FormDataValidator.validateInput(formData)
    const validate_verification_id = FormDataValidator.validateField('vid', pending)

    if (!result.ok || !validate_verification_id.ok) return json({
        error_message: result.error_message || validate_verification_id.error_message
    }, {
        status: 400
    })

    const { კოდი: code } = result.data
    const { value: vid } = validate_verification_id

    const client = await pool.connect();
    try {
        const user_input_hash = createHmac('sha256', process.env.CODE_PEPPER).update(code).digest('hex')        
        const verification_fields = await redisHGetAll(`verify:email:${vid}`)
        if (!verification_fields || verification_fields.code !== user_input_hash) return json({ error_message: "ვერიფიკაციის მცდელობა არასწორია, სცადეთ ხელახლა." }, {
            status: 404
        });
        client.query('BEGIN')
        const result = await verify_email_for(verification_fields, client, event)

        if (!result.ok) {
            await client.query('ROLLBACK')
            return json({ error_message: result.error_message }, {
                status: result.status,
            })
        }

        await client.query('COMMIT')
        if (result.response_type === 'redirect') {
            try {await redisDel(`verify:email:${vid}`)} catch (error) {console.log(error)}
            throw redirect(result.location, {
                status: result.status,
                headers: result.headers
            })
        }
        return json(result, {status: 200})
    } catch (error) {
        if (error instanceof Response) throw error
        await client.query('ROLLBACK');
        return json({ error_message: 'ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.' }, {
            status: 500
        })
    } finally {
        client.release();
    }
}, 'verify-email-handler')

