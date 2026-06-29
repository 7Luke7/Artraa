import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { retreiveCookie } from "../utils";
import { redisDel } from "../lib/redis/basic";
import { pool } from "../db";
import { redis } from "../redis";
import { redisHGet } from "../lib/redis/hash";

export const logout = action(async () => {
  "use server"
  try {
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    if (!cookie) throw redirect('/login')

    const id = retreiveCookie("auth.session-token", cookie);

    if (!id) throw redirect('/login', {
      status: 303,
      headers: new Headers([
        ['Set-Cookie', 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'],
        ['Set-Cookie', 'g_csrf_token=; Path=/; Max-age=0'],
      ])
    })

    const user_id = await redisHGet(`user:session:${id}`, 'user_id')
    if (!user_id) throw redirect('/login', {
      status: 303,
      headers: new Headers([
        ['Set-Cookie', 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'],
        ['Set-Cookie', 'g_csrf_token=; Path=/; Max-age=0'],
      ])
    })

    await pool.query(`
      UPDATE user_devices
        SET session_id=null 
      WHERE user_id=$1 AND session_id=$2
    `, [user_id, id])
    await redisDel(`user:session:${id}`)
    await redis.sRem(`user:sessions:${user_id}`, id)

    throw redirect('/login', {
      status: 303,
      headers: new Headers([
        ['Set-Cookie', 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'],
        ['Set-Cookie', 'g_csrf_token=; Path=/; Max-age=0'],
      ])
    })
  } catch (error) {
    if (error instanceof Response) throw error;
    return json({ error_message: "აქაუნთიდან გასვლა ვერ მოხერხდა." }, { status: 500 });
  }
}, 'destroy-session')