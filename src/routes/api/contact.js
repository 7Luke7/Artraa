import { action, json } from "@solidjs/router"
import { FormDataValidator } from "./validate/validation-service"
import { pool } from "./db"

export const contactForm = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ ok: false, message: validation_result.message, field: validation_result.field }, {
        status: 400
    })
    
    const { name, email, subject, message } = validation_result.data
    
    try {
        const result = await pool.query(
            `INSERT INTO contact_message (name, email, subject, message)
             VALUES ($1, $2, $3, $4)`,
            [name, email, subject, message]
        )

        if (!result.rowCount) json({
            message: "შეტყობინების გაგზავნისას დაფიქსირდა შეცდომა, ხელახლა სცადეთ.",
            field: 'global',
            ok: false
        }, {
            status: 400
        })
    
        return { ok: true, message: `თქვენი შეტყობინება მიღებულია. ვუპასუხებთ 24 საათის განმავლობაში.`}    
    } catch (error) {
        console.log(error)
        return json({
            message: 'შეტყობინების გაგზავნისას დაფიქსირდა შეცდომა, სცადეთ ხელახლა.',
            field: 'global',
            ok: false
         }, {
            status: 500
        })
    }
}, "contact-form")