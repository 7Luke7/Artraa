import { query } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { retreiveCookie } from "../utils"
import { redisHGet } from "../lib/redis/hash"
import { redisTtl } from "../lib/redis/basic"

/**
 * What the verification screen needs to know about the code it is waiting for.
 *
 * The screen previously knew nothing: it asked for six digits without saying
 * where they had been sent or how long they were good for, which is the whole
 * of the "did it go to my old address?" and "has this expired?" confusion.
 *
 * Both answers already existed server-side - the address in the pending hash,
 * the deadline as the key's own TTL - and neither can be derived in the
 * browser, so they are read here rather than guessed there.
 */

/**
 * Masks a local part to its first character: luka@gmail.com -> l•••@gmail.com.
 *
 * Enough for the sender to recognise their own address and not enough for a
 * shoulder-surfer to learn one. A single-character local part is masked whole
 * rather than shown in full.
 */
const mask_email = (email) => {
    if (typeof email !== 'string') return null
    const at = email.lastIndexOf('@')
    if (at < 1) return null

    const local = email.slice(0, at)
    const domain = email.slice(at)

    return (local.length > 1 ? local[0] : '') + '•••' + domain
}

export const pending_verification = query(async () => {
    "use server"
    const { request } = getRequestEvent()
    const cookie = request.headers.get('cookie')
    if (!cookie) return null

    const vid = retreiveCookie('pending_verification', cookie)
    if (!vid) return null

    try {
        const key = `pending:verification:${vid}`
        const [email, expires_in] = await Promise.all([
            redisHGet(key, 'email'),
            redisTtl(key)
        ])

        // The raw address never leaves the server. Only the masked form and the
        // deadline do, so the payload stays useless to anyone who intercepts it.
        return { email_hint: mask_email(email), expires_in: expires_in ?? null }
    } catch (error) {
        // The screen is fully usable without either value; a failure here must
        // not stop someone entering a code that is sitting in their inbox.
        return null
    }
}, 'pending-verification')
