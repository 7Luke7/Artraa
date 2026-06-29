import { action, json } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { retreiveCookie, send_verification_code } from "../../utils"
import { FormDataValidator } from "../../validate/validation-service"
import { createHmac, randomInt } from "node:crypto"
import { redisHGet, redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"

export const resend_code = action(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookies = request.headers.get('cookie')
    if (!cookies) return json({ field: 'global', message: "არასწორი მონაცემები." }, { status: 401 })
    const pending = retreiveCookie('pending_verification', cookies)

    if (!pending) return json({ field: 'global', message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 401 })

    const validation_result = FormDataValidator.validateField('vid', pending)

    if (!validation_result.ok) return json({ field: 'global', message: validation_result.message }, { status: 400 })  
    const {value: vid} = validation_result

    const email = await redisHGet(`pending:verification:${vid}`, 'email')
    if (!email) return json({ field: 'global', message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 401 })

    const verification_code = randomInt(100000, 1000000).toString();
    const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
    try {
        await redisHSet(`pending:verification:${vid}`, {code: hashed_verification_code})
        await redis.expire(`pending:verification:${vid}`, 900)
        const send_email_result = await send_verification_code(email, verification_code)

        if (send_email_result.status !== 200) return json({field: 'global', message: 'დაფიქსირდა შეცდომა კოდის გაგზავნისას, სცადეთ ხელახლა.'}, {status: 500}) 
        
        return json({field: 'global', ok: true, message: "კოდი ხელახლა გაიგზავნა." }, {
            status: 200,
            headers: {
                'Set-Cookie': `pending_verification=${vid}; Path=/; Max-Age=900; HttpOnly; Secure; SameSite=Strict`,
            }
        })
    } catch (error) {
        console.log(error)
        return json({ field: 'global', field: "დაფიქსირდა შეცდომა, სცადეთ ხელახლა." }, { status: 500 })
    }
}, 'resend-code')