import { query } from "@solidjs/router"
import { getCookie } from "../utils"
import { getRequestEvent } from "solid-js/web"
import { pool } from "../db"

export const ProtectResetPassword = query(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookie = request.headers.get('cookie')

    console.log("ProtectResetPassword: ", cookie)
    if (!cookie) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401}
    
    const rs = getCookie('reset_session', cookie)
    if (!rs) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

    try {
        const reset_session = await pool.query(`
            SELECT user_id FROM password_reset_sessions
            WHERE id=$1
        `, [rs])

        if (reset_session.rowCount === 0) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

        return {allowed: true, status: 200}
    } catch (error) {
        console.log(error)
        return {allowed: false, message: 'ათენთიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.', status: 500}
    }
}, 'protect-reset-password')