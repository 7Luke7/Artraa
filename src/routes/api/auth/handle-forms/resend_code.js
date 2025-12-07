import { action, json } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { getCookie, send_verification_code } from "../../utils"
import { FormDataValidator } from "../../validate/validation-service"
import { createHmac, randomInt } from "node:crypto"
import { redisHGet, redisHSet } from "../../lib/redis/hash"
import { redis } from "../../redis"

export const resend_code = action(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookies = request.headers.get('cookie')
    if (!cookies) return json({ error_message: "არასწორი მონაცემები." }, { status: 401 })
    const pending = getCookie('pending_verification', cookies)

    if (!pending) return json({ error_message: "ვერიფიკაციის იდენტიფიკატორი ვერ მოიძებნა." }, { status: 400 })

    const result = FormDataValidator.validateField('vid', pending)

    if (!result.ok) return json({ error_message: result.error_message }, { status: 400 })  

    const {value: vid} = result
    const verification_code = randomInt(100000, 1000000).toString();
    const hashed_verification_code = createHmac('sha256', process.env.CODE_PEPPER).update(verification_code).digest('hex')
    try {
        await redisHSet(`verify:email:${vid}`, {code: hashed_verification_code})
        await redis.expire(`verify:email:${vid}`, 600)
        const result = await redisHGet(`verify:email:${vid}`, 'email')     
        if (!result)return json({message: 'დაფიქსირდა შეცდომა კოდის გაგზავნისას, სცადეთ ხელახლა.'}, {status: 500}) 
        const send_email_result = await send_verification_code(result, verification_code)

        if (send_email_result.status !== 200) return json({message: 'დაფიქსირდა შეცდომა კოდის გაგზავნისას, სცადეთ ხელახლა.'}, {status: 500}) 
        
        return json({ message: "კოდი ხელახლა გაიგზავნა." }, {status: 200})
    } catch (error) {
        console.log(error)
        return json({ error_message: "დაფიქსირდა შეცდომა, სცადეთ ხელახლა." }, { status: 500 })
    }
}, 'resend-code')