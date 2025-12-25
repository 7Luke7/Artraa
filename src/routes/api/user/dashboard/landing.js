import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../../utils";
import { query } from "@solidjs/router";
import { redisExists } from "../../lib/redis/basic";
import { redisHGet } from "../../lib/redis/hash";

export const get_header = query(async () => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) return null

    const id = getCookie("auth.session-token", cookie);
    if (!id) return null

    const auth = await redisExists(`user:session:${id}`)
    if (!auth) return null
    try {
        const data = await redisHGet(`user:session:${id}`, 'pfp')
        if (!data) return true
        
        return data
    } catch(error) {
        console.log(error)
    }
}, 'get-user-header')