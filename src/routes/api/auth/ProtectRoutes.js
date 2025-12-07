import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../utils";
import { redisExists } from "../lib/redis/basic";

export const protect_anonymous_routes = query(async () => {
  'use server'
  try {
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    if (!cookie) return true;

    const id = getCookie("auth.session-token", cookie);
    if (!id) return true;
    
    const sess = await redisExists(`user:session:${id}`)
    if (sess) throw redirect('/dashboard', { status: 303 })
    return true
  } catch (error) {
    if (error instanceof Response) throw error
    return true;
  }
}, 'protect-anonymous-route')

export const ProtectVerifyRoute = query(async () => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get('cookie')

  if (!cookie) return { allowed: false, message: 'არ გაქვთ წვდომის უფლება', status: 401 }

  const pending_verification_id = getCookie('pending_verification', cookie)
  if (!pending_verification_id) return { allowed: false, message: 'არ გაქვთ წვდომის უფლება', status: 401 }

  try {
    const vid = await redisExists(`verify:email:${pending_verification_id}`)
    if (!vid) return { allowed: false, message: 'არ გაქვთ წვდომის უფლება', status: 401 }

    return { allowed: true, status: 200}
  } catch (error) {
    console.log(error)
    return { allowed: false, message: 'დაფიქსირდა შეცდომა, გთხოვთ გადატვირთოთ გვერდი.', status: 500 }
  }
}, 'protect-verify-email')

export const ProtectResetPassword = query(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookie = request.headers.get('cookie')

    if (!cookie) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401}
    const rs = getCookie('reset_session', cookie)
    if (!rs) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

    try {
      const password_reset_session = await redisExists(`password:reset:${rs}`)
      if (!password_reset_session) return {allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

      return {allowed: true, status: 200}
    } catch (error) {
        console.log(error)
        return {allowed: false, message: 'ათენთიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.', status: 500}
    }
}, 'protect-reset-password')