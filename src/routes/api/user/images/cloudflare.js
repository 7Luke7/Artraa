import { action, query, redirect } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { redisHGet, redisHModValue } from "../../lib/redis/hash"
import { pool } from "../../db"
import { retreiveCookie } from "../../utils"
import { redisExists } from "../../lib/redis/basic"

export const get_image_upload_url = query(async () => {
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
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.CF_IMAGES_TOKEN}`,
                },
                body: (() => {
                    const form = new FormData()
                    form.append("requireSignedURLs", "false")
                    return form
                })()
            }
        )

        if (!res.ok) return {ok: false}

        const data = await res.json()
        return {
            ok: true,
            result: data.result
        }
    } catch (error) {
        if (error instanceof Response) throw error
        return {ok: false}
    }
}, 'get-image-upload-url')

export const save_profile_picture = action(async (cfImageId) => {
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
        if (!cfImageId) throw new Error("No image ID")

        await pool.query(
            `UPDATE "User" SET avatar = $1 WHERE id = $2`,
            ["cf:" + cfImageId, user_id]
        )
        await redisHModValue(`user:session:${id}`, 'pfp', `cf:${cfImageId}`)

        return { ok: true }
    } catch(error) {
        if (error instanceof Response) throw error
        console.log(error)
    }
}, "save-profile-picture")