import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { FormDataValidator } from "../../validate/validation-service";
import { verify_email_for } from "./verify_email_for";
import { getCookie } from "../../utils";
import { createHmac } from "node:crypto"
import { redisHGetAll } from "../../lib/redis/hash";
import { redisDel } from "../../lib/redis/basic";

export const verify_email_action = action(async (formData) => {
    "use server"
    const event = getRequestEvent()
    const cookies = event.request.headers.get('cookie')

    if (!cookies) return json({ field: 'global', message: "არასწორი მონაცემები." }, { status: 401 })

    const pending = getCookie('pending_verification', cookies)
    if (!pending) return json({ field: 'global', message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 400 })

    const result = FormDataValidator.validateInput(formData)
    const validate_verification_id = FormDataValidator.validateField('vid', pending)

    if (!result.ok) return json({
        message: result.message,
        field: result.field
    }, {
        status: 400
    })

    if (!validate_verification_id.ok) return json({
        field: 'global',
        message: 'ვერიფიკაციის იდენტიფიკატორი არასწორია, გთხოვთ ხელახლა გაიგზავნოთ კოდი, ან თავიდან გაიარეთ რეგისტრაცია.'
    }, { status: 400 })
    const { 'one-time-code': code } = result.data
    const { value: vid } = validate_verification_id

    try {
        const user_input_hash = createHmac('sha256', process.env.CODE_PEPPER).update(code).digest('hex')
        const verification_fields = await redisHGetAll(`pending:verification:${vid}`)
        if (!verification_fields || verification_fields.code !== user_input_hash) return json({ field: "one-time-code", message: "ვერიფიკაციის მცდელობა არასწორია, სცადეთ ხელახლა." }, {
            status: 400
        });
        const result = await verify_email_for(verification_fields, event)

        if (!result.ok) {
            return json({ field: 'global', message: result.error_message }, {
                status: result.status,
            })
        }

        if (result.response_type === 'redirect') {
            try { await redisDel(`pending:verification:${vid}`) } catch (error) { }
            throw redirect(result.location, {
                status: result.status,
                revalidate: ['auth', 'protect-verify', 'get-user-header'],
                headers: result.headers
            });
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error
        return json({ field: 'global', message: 'ვერიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.' }, {
            status: 500
        })
    }
}, 'verify-email-handler')

