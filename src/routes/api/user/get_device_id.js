import { query } from "@solidjs/router";
import { retreiveCookie } from "../utils";
import { redisHGet } from "../lib/redis/hash";
import { getRequestEvent } from "solid-js/web";

export const get_device_id = query(async () => {
    'use server'
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    if (!cookie) return null;

    const id = retreiveCookie("auth.session-token", cookie);
    if (!id) return null

    try {
        const device_id = await redisHGet(`user:session:${id}`, 'device_id')
        if (!device_id) return null
        return device_id
    } catch (error) {
        return null
    }
}, 'device-id')
