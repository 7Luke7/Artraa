import { json, query, redirect } from "@solidjs/router"
import { pool } from "../db"
import { getRequestEvent } from "solid-js/web"
import { format_to_time, retreiveCookie } from "../utils"
import { redisExists } from "../lib/redis/basic"
import { redis } from "../redis"
import { redisHGet, redisHSet } from "../lib/redis/hash"
import { logError } from "../lib/log"

export const get_new_notification_count = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const id = retreiveCookie("auth.session-token", cookie);
    if (!id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${id}`, 'user_id')
        if (!user_id) throw redirect('/login')

        const notification_count = await redisHGet(`user:notifications:${user_id}`, 'unseen_notification_count')

        return notification_count ?? 0
    } catch (error) {
        logError("user/notifications", error)
    }
}, 'new-notification-count')

export const get_all_notifications_count = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const id = retreiveCookie("auth.session-token", cookie);
    if (!id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${id}`, 'user_id')
        if (!user_id) throw redirect('/login')

        const notification_count = await redisHGet(`user:notifications:${user_id}`, 'notification_count')

        return notification_count ?? 0
    } catch (error) {
        logError("user/notifications", error)
    }
}, 'get-all-notifications')

export const get_notifications = query(async ({ created_at, id }) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const cookie_id = retreiveCookie("auth.session-token", cookie);
    if (!cookie_id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${cookie_id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${cookie_id}`, 'user_id')
        if (!user_id) throw redirect('/login')
        const text = `
            SELECT 
            id, user_id, notif_type, title, description, seen, created_at FROM notifications
            WHERE user_id=$1 
            AND (
                $2::UUID IS NULL OR
                $3::timestamp IS NULL OR
                ((created_at, id) <= ($3, $2) AND $2 != id)
            )  
            ORDER BY created_at DESC, id DESC
            LIMIT 8
        `

        const notifications_result = await pool.query(text, [user_id, id, created_at])

        if (!notifications_result.rowCount) return json({
            ok: false
        }, { status: 400 })

        const notifications = notifications_result.rows
        notifications.forEach((notification) => {
            notification['parsed_notification'] = format_to_time(notification['created_at'])
        })

        return json({
            ok: true,
            data: notifications
        }, { status: 200 })
    } catch (error) {
        if (error instanceof Response) throw error
        logError("user/notifications", error)
    }
}, 'get-active-sessions')

export const mark_notification_as = async (id, seen) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const session_id = retreiveCookie("auth.session-token", cookie);
    if (!session_id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${session_id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${session_id}`, 'user_id')
        if (!user_id) throw redirect('/login')

        const update_seen = await pool.query(`
            UPDATE notifications
            SET seen=$4
            WHERE user_id=$1 AND id=$2 AND seen=$3
        `, [user_id, id, !seen, seen])

        if (!update_seen.rowCount) return json({ ok: false, message: "დაფიქსირდა შეცდომა." }, {
            status: 500
        })
        await redis.hIncrBy(`user:notifications:${user_id}`, 'unseen_notification_count', seen ? -1 : 1)

        return json({ ok: true }, {
            status: 200
        })
    } catch (error) {
        if (error instanceof Response) throw error
        logError("user/notifications", error)
    }
}

export const remove_notification = async (id, seen) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const session_id = retreiveCookie("auth.session-token", cookie);
    if (!session_id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${session_id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${session_id}`, 'user_id')
        if (!user_id) throw redirect('/login')

        const remove_notification = await pool.query(`
            DELETE FROM notifications
            WHERE user_id=$1 AND id=$2
        `, [user_id, id])

        if (!remove_notification.rowCount) return json({ ok: false, message: "დაფიქსირდა შეცდომა." }, {
            status: 500
        })
        if (!seen) await redis.hIncrBy(`user:notifications:${user_id}`, 'unseen_notification_count', -1)
        await redis.hIncrBy(`user:notifications:${user_id}`, 'notification_count', -1)

        return json({ ok: true }, {
            status: 200
        })
    } catch (error) {
        logError("user/notifications", error)
        if (error instanceof Response) throw error
    }
}

export const mark_all_notification_as_seen = async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const session_id = retreiveCookie("auth.session-token", cookie);
    if (!session_id) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    const auth = await redisExists(`user:session:${session_id}`)
    if (!auth) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })
    try {
        const user_id = await redisHGet(`user:session:${session_id}`, 'user_id')
        if (!user_id) throw redirect('/login')

        const update_seen = await pool.query(`
            UPDATE notifications
            SET seen=$3
            WHERE user_id=$1 AND seen=$2
        `, [user_id, false, true])

        if (!update_seen.rowCount) return json({ ok: false, message: "დაფიქსირდა შეცდომა." }, {
            status: 500
        })
        await redisHSet(`user:notifications:${user_id}`, { unseen_notification_count: 0 })

        return json({ ok: true }, {
            status: 200
        })
    } catch (error) {
        logError("user/notifications", error)
        if (error instanceof Response) throw error
    }
}
