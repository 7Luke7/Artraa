import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../utils";
import { pool } from "../db";

export const protect_anonymous_routes = query(async () => {
  'use server'
  try {
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    console.log("protect_anonymous_key: ", cookie)
    if (!cookie) return true;

    const token = getCookie("auth.session-token", cookie);
    if (!token) return true;

    const session = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM "Session" WHERE session_token=$1 AND expires > NOW() AT TIME ZONE 'UTC')`,
      [token]
    );

    if (session.rows[0].exists) throw redirect('/dashboard', { status: 303 })
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
    const result = await pool.query(`
      SELECT EXISTS(SELECT 1 FROM email_verifications WHERE id=$1 AND expires_at > NOW() AT TIME ZONE 'UTC')
    `, [pending_verification_id])

    if (!result.rows[0].exists) return { allowed: false, message: 'არ გაქვთ წვდომის უფლება', status: 401 }

    return { allowed: true, status: 200}
  } catch (error) {
    console.log(error)
    return { allowed: false, message: 'დაფიქსირდა შეცდომა, გთხოვთ გადატვირთოთ გვერდი.', status: 500 }
  }
}, 'protect-verify-email')