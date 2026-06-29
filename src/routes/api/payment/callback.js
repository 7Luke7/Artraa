"use server"
import { handleBogCallback } from "./payment"

const BOG_ALLOWED_IPS    = [
    "91.239.195.",
    "91.239.196.",
    "185.65.243.",
]
export async function POST({ request }) {
    const allowed = BOG_ALLOWED_IPS.some(prefix => ip.startsWith(prefix))
    if (!allowed && PROD) {
        console.warn(`[security] BOG callback from unknown IP: ${ip}`)
        return new Response("Forbidden", { status: 403 })
    }
    try {
        const body = await request.json()
        console.log("[BOG callback]", body)

        const result = await handleBogCallback(body)

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (err) {
        console.error("[BOG callback error]", err)
        return new Response(JSON.stringify({ ok: false }), { status: 200 })
    }
}