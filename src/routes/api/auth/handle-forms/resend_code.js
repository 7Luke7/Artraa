import { action, json } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { getCookie, send_verification_code } from "../../utils"
import { pool } from "../../db"
import { FormDataValidator } from "../../validate/validation-service"
import { createHmac, randomInt } from "node:crypto"

export const resend_code = action(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookies = request.headers.get('cookie')
    if (!cookies) return json({ error_message: "არასწორი მონაცემები." }, { status: 401 })
    const pending = getCookie('pending_verification', cookies)

    if (!pending) return json({ error_message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 400 })

    const result = FormDataValidator.validateField('vid', pending)

    if (!result.ok) return json({ error_message: result.error_message }, { status: 400 })  

    const verification_code = randomInt(100000, 1000000).toString();
    const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
    try {
        const result = await pool.query(`
            UPDATE email_verifications 
            SET verification_code=$1, created_at=NOW() AT TIME ZONE 'UTC',
                expires_at=NOW() AT TIME ZONE 'UTC' + INTERVAL '30 minutes'
            WHERE id=$2 AND expires_at > NOW() AT TIME ZONE 'UTC'
            RETURNING email
        `, [hashed_verification_code, pending])

        if (result.rowCount === 0) return json({ error_message: "კოდი ვადაგასულია, მომხდარ შეცდომაა." }, { status: 400 })
        
        const send_email_result = await send_verification_code(result.rows[0].email, verification_code)

        if (send_email_result.status !== 200) return json({message: 'დაფიქსირდა შეცდომა კოდის გაგზავნისას, სცადეთ ხელახლა.'}) 
        
        return json({ message: "კოდი ხელახლა გაიგზავნა." })
    } catch (error) {
        console.log(error)
        return json({ error_message: "დაფიქსირდა შეცდომა, სცადეთ ხელახლა." }, { status: 500 })
    }
}, 'resend-code')