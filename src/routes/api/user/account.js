import { json, query, redirect } from "@solidjs/router"
import { get_session_data } from "../auth/ProtectRoutes"
import { pool } from "../db"
import { getRequestEvent } from "solid-js/web"
import { format_to_time, getCookie } from "../utils"
import { redisExists } from "../lib/redis/basic"

export const get_user = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const id = getCookie("auth.session-token", cookie);
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
        const data = await get_session_data(id, ['user_id'])
        if (!data) throw redirect('/login')
        const user = await pool.query(`
            SELECT created_at, email, name, profile_picture_link FROM "User"
            WHERE id=$1
        `, [data.user_id])

        if (!user.rowCount) return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})

        const { created_at, ...rest } = user.rows[0]
        const parsed_created_at = new Intl.DateTimeFormat("ka-GE", {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(created_at))

        return {
            parsed_created_at,
            ...rest
        }
    } catch (error) {
        if (error instanceof Response) throw error
        return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
    }
}, 'get-user-data')

export const get_security_details = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const id = getCookie("auth.session-token", cookie);
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
        const data = await get_session_data(id, ['user_id'])
        if (!data) throw redirect('/login')
        const user_devices = await pool.query(`
            SELECT
            jsonb_build_object(
                'google', u.google_id IS NOT NULL,
                'password', u.password IS NOT NULL,
                'sessions', COALESCE(
                    jsonb_agg(jsonb_build_object(
                        'id', ud.id,
                        'browser', ud.browser,
                        'browser_version', ud.browser_version,
                        'os', ud.os,
                        'os_version', ud.os_version,
                        'device_type', ud.device_type,
                        'device_vendor', ud.device_vendor,
                        'device_model', ud.device_model,
                        'last_used', ud.last_used,
                        'session_id', ud.session_id,
                        'status', ud.status,
                        'pending_verification_id', ud.pending_verification_id
                    ))
                    FILTER (WHERE ud.id IS NOT NULL),
                    '[]'::jsonb
                )
            ) AS security
            FROM user_devices ud
            INNER JOIN "User" u ON u.id = ud.user_id
            WHERE ud.user_id=$1
            GROUP BY u.id
        `, [data.user_id])

        if (!user_devices.rowCount) return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})

        const { security } = user_devices.rows[0]
        security.sessions.forEach(async (device) => {
            if (device.session_id === id) {
                device['current_session'] = true
                delete device['session_id']
                delete device['id']
            }
            device['last_used'] = format_to_time(device['last_used'])
            if (device.pending_verification_id) {
                const is_pending = await redisExists(`pending:verification:${device.pending_verification_id}`)
                if (!is_pending) {
                    delete device['status']
                    delete device['pending_verification_id']
                }
            }
        })

        security.sessions.sort((a, b) => {
            if (a.current_session) return -1
            if (b.current_session) return 1
            return new Date(b.last_used) - new Date(a.last_used)
        })

        return security
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error
        return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
    }
}, 'get-security-details')

export const unblock_devicee = async (device_id) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const id = getCookie("auth.session-token", cookie);
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
        const data = await get_session_data(id, ['user_id'])
        if (!data) throw redirect('/login')

        const res = await pool.query(`
            UPDATE user_devices
                SET status='trusted'
            WHERE user_id=$1 AND id=$2
        `, [data.user_id, device_id])
        if (!res.rowCount) return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
        return json({ok: true}, {status: 200})
    } catch (error) {
        return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
    }
}

export const block_deviee = async (device_id) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) throw redirect('/login', {
        status: 302,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const id = getCookie("auth.session-token", cookie);
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
        const data = await get_session_data(id, ['user_id'])
        if (!data) throw redirect('/login')

        const res = await pool.query(`
            UPDATE user_devices
                SET status='blocked'
            WHERE user_id=$1 AND id=$2
        `, [data.user_id, device_id])
        if (!res.rowCount) return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
        return json({ok: true}, {status: 200})
    } catch (error) {
        return json({ok: false, message: "დაფიქსირდა შეცდომა"}, {status: 500})
    }
}