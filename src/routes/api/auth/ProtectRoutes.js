import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "../utils";
import { redisExists } from "../lib/redis/basic";
import { redisHGet } from "../lib/redis/hash";

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
    if (auth_state) throw redirect('/')
    return new Response(true, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      }
    })
  } catch (error) {
    if (error instanceof Response) throw error
    console.log(error)
  }
}, 'protect-anonymous')

export const protected_route = query(async () => {
  'use server'
  try {
    const auth_state = await auth()
    if (!auth_state) throw redirect('/login', {
      headers: {
        'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        'Cache-control': 'no-cache, private, '
      }
    })
    return true
  } catch (error) {
    if (error instanceof Response) throw error
    console.log(error)
  }
}, 'protected')

export const get_session_data = query(async (id, field = []) => {
  'use server'
  try {
    if (!field.length) return null
    const results = await Promise.all(
      field.map(async (f) => {
        const data = await redisHGet(`user:session:${id}`, f)
        return data ? { [f]: data } : null
      })
    )
    const filtered = results.filter(Boolean)

    return filtered.length ? Object.assign({}, ...filtered) : null
  } catch (error) {
    return { error: 'დაფიქსირდა შეცდომა', status: 500 };
  }
}, 'get-session-data')

export const ProtectVerifyRoute = query(async () => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get('cookie')

  if (!cookie) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })
  const pending_verification_id = getCookie('pending_verification', cookie)
  if (!pending_verification_id) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })

  try {
    const vid = await redisExists(`pending:verification:${pending_verification_id}`)
    if (!vid) return new Response(true, {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })

    return new Response(true, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  } catch (error) {
    return new Response(true, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  }
}, 'protect-verify-route')

export const ProtectPendingRoute = query(async () => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get('cookie')

  if (!cookie) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })
  const pending_verification_id = getCookie('pending_verification', cookie)
  if (!pending_verification_id) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })

  try {
    const vid = await redisExists(`pending:verification:${pending_verification_id}`)
    if (!vid) return new Response(true, {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
    return new Response(true, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  } catch (error) {
    return new Response(true, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  }
}, 'protect-pending-route')

export const ProtectResetPassword = async () => {
  "use server"
  const { request } = getRequestEvent()
  const cookie = request.headers.get('cookie')

  if (!cookie) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })
  const rs = getCookie('reset_session', cookie)
  if (!rs) return new Response(true, {
    status: 401,
    headers: {
      'Content-Type': 'text/html',
      'Cache-control': 'no-store'
    }
  })
  try {
    const password_reset_session = await redisExists(`password:reset:${rs}`)
    if (!password_reset_session) return new Response(true, {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })

    return new Response(true, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  } catch (error) {
    console.log(error)
    return new Response(true, {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'Cache-control': 'no-store'
      }
    })
  }
}