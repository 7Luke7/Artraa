import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../utils";
import { redisExists } from "../lib/redis/basic";
import { redisHGet, redisHGetAll } from "../lib/redis/hash";

export const auth = query(async () => {
  'use server'
  const event = getRequestEvent();
  const cookie = event.request.headers.get("cookie");
  if (!cookie) return false;

  const id = getCookie("auth.session-token", cookie);
  if (!id) return false;

  try {
    const sess = await redisExists(`user:session:${id}`)
    if (!sess) return false
    return true
  } catch (error) {
    return { error: 'დაფიქსირდა შეცდომა', status: 500 };
  }
}, 'auth')

export const protect_anonymous = query(async () => {
  'use server'
  try {
    const auth_state = await auth()
    if (auth_state) throw redirect('/dashboard')
    return true
  } catch (error) {
    if (error instanceof Response) throw error
    console.log(error)
  }
}, 'protect-anonymous')

export const protected_route = query(async () => {
  'use server'
  try {
    const auth_state = await auth()
    if (!auth_state) throw redirect('/login')
    return true
  } catch (error) {
    if (error instanceof Response) throw error
    console.log(error)
  }
}, 'protected')

export const get_session_data = async (id, field = null) => {
  'use server'
  try {
    if (field) {
      const sess = await redisHGet(`user:session:${id}`, field)
      if (!sess) return false
      return sess
    } else {
      const sess = await redisHGetAll(`user:session:${id}`)
      if (!sess) return false
      return sess
    }
  } catch (error) {
    return { error: 'დაფიქსირდა შეცდომა', status: 500 };
  }
}

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

    return { allowed: true, status: 200 }
  } catch (error) {
    console.log(error)
    return { allowed: false, message: 'დაფიქსირდა შეცდომა, გთხოვთ გადატვირთოთ გვერდი.', status: 500 }
  }
}, 'protect-verify-email')

export const ProtectResetPassword = async () => {
  "use server"
  const { request } = getRequestEvent()
  const cookie = request.headers.get('cookie')

  if (!cookie) return { allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }
  const rs = getCookie('reset_session', cookie)
  if (!rs) return { allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

  try {
    const password_reset_session = await redisExists(`password:reset:${rs}`)
    if (!password_reset_session) return { allowed: false, message: 'თქვენ არ გაქვთ გვერდზე წვდომის უფლება.', status: 401 }

    return { allowed: true, status: 200 }
  } catch (error) {
    console.log(error)
    return { allowed: false, message: 'ათენთიფიკაცია შეცდომით დასრულდა, სცადეთ ხელახლა.', status: 500 }
  }
}