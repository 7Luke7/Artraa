import { action, json } from "@solidjs/router";
import { FormDataValidator } from "../../validate/validation-service";
import {createHmac, randomBytes } from "node:crypto";
import { pool } from "../../db";
import { send_verification_link } from "../../utils";
import { redisSet } from "../../lib/redis/basic";

export const findUserForReset = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)

    if (!validation_result.ok) return json({ field: validation_result.field, message: validation_result.message }, {
        status: 400
    })
    const { email } = validation_result.data

    try {
        const res = await pool.query(`SELECT google_id, password, id FROM "User" WHERE email = $1`, [email]);
        if (!res.rowCount) return json({ ok: true, field: 'global', message: "ინსტრუქცია გამოგეგზავნათ, თუ ეს ელ.ფოსტა დარეგისტრირებულია ჩვენს სისტემაში." }, {status: 200});

        const {google_id, password, id} = res.rows[0];

        if (google_id && !password) return json({ type: 'hint', field: 'global', message: 'თქვენ რეგისტრირებული ხართ Google-ის მეშვეობით გთხოვთ შეხვიდეთ თქვენს ექაუნთში და დააყენოთ პაროლი' }, {status: 400});

        const token = randomBytes(48).toString("hex");
        const hashed_code = createHmac('sha256', process.env.PASSWORD_RESET_SECRET).update(token).digest('hex')
        await redisSet(`pending:verification:${hashed_code}`, id, 900)

        const base = process.env.VITE_URL
        const reset_link = `${base}/api/auth/issue_session?token=${token}`;

        const email_result = await send_verification_link(email, reset_link);

        if (email_result.status !== 200) return json(
            { field: 'global', message: "მეილის გაგზავნა ვერ მოხერხდა, სცადეთ ხელახლა." },
            { status: 500 }
        );

        return json({
            ok: true,
            field: 'global',
            message: "ინსტრუქცია გამოგეგზავნათ, თუ ეს ელ.ფოსტა დარეგისტრირებულია ჩვენს სისტემაში."
        }, {status: 200});
    } catch (error) {
        console.log(error)
        return json({ field: 'global', message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.' }, { status: 500 })
    }
}, 'find-user-for-reset')