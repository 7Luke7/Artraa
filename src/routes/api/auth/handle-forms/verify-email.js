import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { FormDataValidator } from "../../validate/validation-service";
import { pool } from "../../db";
import { verify_email_for } from "./verify_email_for";
import { getCookie } from "../../utils";
import {createHmac} from "node:crypto"

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
        await client.query('BEGIN');
        const user_input_hash = createHmac('sha256', process.env.CODE_PEPPER).update(code).digest('hex')

        const verification_result = await client.query(`
            SELECT name, email, password_hash, remember_me, verification_code, verification_type, user_id, salt FROM email_verifications
            WHERE id=$1 AND verification_code=$2
        `, [vid, user_input_hash])

        if (verification_result.rowCount === 0) {
            return json({ error_message: "ვერიფიკაციის მცდელობა არასწორია, სცადეთ ხელახლა." }, {
                status: 404
            });
        }
        const result = await verify_email_for(verification_result.rows[0], client, event)

        if (!result.ok) {
            await client.query('ROLLBACK')
            return json({ error_message: result.error_message }, {
                status: result.status,
            })
        }

        await client.query(`
            DELETE FROM email_verifications WHERE id=$1
        `, [vid])

        await client.query('COMMIT')
        if (result.response_type === 'redirect') throw redirect(result.location, {
            status: result.status,
            headers: result.headers
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error
        await client.query('ROLLBACK');
        return json({ error_message: 'ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.' }, {
            status: 500
        })
    } finally {
        client.release();
    }
}, 'verify-email-handler')

