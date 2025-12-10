import { json, query, redirect } from "@solidjs/router"
import { get_session_data } from "../auth/ProtectRoutes"
import { pool } from "../db"
import { getRequestEvent } from "solid-js/web"
import { getCookie } from "../utils"

export const get_user = query(async () => {
    'use server'
    const {request} = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) return false;
    
    const id = getCookie("auth.session-token", cookie);
    if (!id) return false;
    try {
        const user_id = await get_session_data(id, 'user_id')
        if (!user_id) throw redirect('/login')
        const user = await pool.query(`
            SELECT created_at, email, name, profile_picture_link FROM "User"
            WHERE id=$1
        `, [user_id])

        if (!user.rowCount) return json({message: "მომხმარებელი არ არსებობს."}, {status: 400})
        
        const {created_at, ...rest} = user.rows[0]

        return {
            parsed_created_at: new Intl.DateTimeFormat("ka-GE", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(new Date(created_at)),
            ...rest
        }
    } catch (error) {
        if (error instanceof Response) throw error
        console.log(error)
    }
}, 'get-user-data')