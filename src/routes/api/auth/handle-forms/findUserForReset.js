import { action, json } from "@solidjs/router";
import { FormDataValidator } from "../../validate/validation-service";
import {createHmac, randomBytes } from "node:crypto";
import { pool } from "../../db";
import { send_verification_link } from "../../utils";
import { redisSet } from "../../lib/redis/basic";

export const findUserForReset = action(async (formData) => {
    "use server"
    const validation_result = FormDataValidator.validateInput(formData)

    if (!validation_result.ok) return json({ error_message: validation_result.error_message }, {
        status: 400
    })
    const { მეილი: email } = validation_result.data

    try {
        const res = await pool.query(`SELECT id FROM "User" WHERE email = $1`, [email]);
        if (!res.rowCount) return json({ message: "თუ მეილი არსებობს, მიიღებთ ბმულს." });

        const token = randomBytes(48).toString("hex");
        const hashed_code = createHmac('sha256', process.env.PASSWORD_RESET_SECRET).update(token).digest('hex')

        const {id} = res.rows[0];

        const insert_hash = await redisSet(`verify:email:${hashed_code}`, id, 600)

        if (!insert_hash) return json({ message: 'მოძებნა ვერ განხორციელდა' }, { status: 400 })
        const base = process.env.VITE_URL
        const reset_link = `${base}/api/auth/issue_session?token=${token}`;

        const email_result = await send_verification_link(email, reset_link);

        if (email_result.status !== 200) return json(
            { message: "მეილის გაგზავნა ვერ მოხერხდა, სცადეთ ხელახლა." },
            { status: 500 }
        );

        return json({
            message: "თუ მეილი არსებობს, მიიღებთ ბმულს."
        });
    } catch (error) {
        console.log(error)
        return json({ message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.' }, { status: 500 })
    }
}, 'find-user-for-reset')