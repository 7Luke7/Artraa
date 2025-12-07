import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../utils";
import { redisDel } from "../lib/redis/basic";

export const logout = action(async () => {
  "use server"
  try {
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    if (!cookie) return 'no cookie available';

    const id = getCookie("auth.session-token", cookie);
    if (!id) return 'no cookie available';

    const sess = await redisDel(`user:session:${id}`)

    if (!sess) return json({ error_message: "აქაუნთიდან გასვლა ვერ მოხერხდა." }, {status: 500});
    throw redirect('/login', {
      status: 303,
      headers: {
        'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
      }
    })
  } catch (error) {
    if (error instanceof Response) throw error;
    return json({ error_message: "აქაუნთიდან გასვლა ვერ მოხერხდა." }, {status: 500});
  }
}, 'destroy-session')