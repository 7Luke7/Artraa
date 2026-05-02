"use server"
/**
 * src/routes/api/payment/callback.js
 *
 * BOG calls this URL via POST after every payment (success or fail).
 * Must be HTTPS in production. Register this URL in businessmanager.bog.ge.
 */

import { handleBogCallback } from "~/api/payment"

export async function POST({ request }) {
    try {
        const body = await request.json()
        console.log("[BOG callback]", body)

        const result = await handleBogCallback(body)

        // BOG requires HTTP 200 to consider callback delivered
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("[BOG callback error]", err)
        // Still return 200 so BOG doesn't retry infinitely
        return new Response(JSON.stringify({ ok: false }), { status: 200 })
    }
}