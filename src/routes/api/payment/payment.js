'use server'
import { pool } from "../db"
import { get_bog_access_token } from "./authenticate"

const BOG_ORDER_URL = "https://api.bog.ge/payments/v1/ecommerce/orders"

export async function createBogOrder({
    courseId,
    courseTitle,
    price,
    userId,
    userEmail,
    userName,
    paymentMethods = [
        "card",
        "google_pay",
        "apple_pay",
    ],
}) {
    const token = await get_bog_access_token()
    const baseUrl = process.env.VITE_URL
    const shopOrderId = `artra-${courseId}-${userId}-${Date.now()}`
    
    await pool.query(`
        INSERT INTO payment_order (shop_order_id, user_id, course_id, amount, status, created_at)
        VALUES ($1, $2, $3, $4, 'pending', NOW())
    `, [shopOrderId, userId, courseId, price])

    const body = {
        callback_url: `${baseUrl}/api/payment/callback`,
        external_order_id: shopOrderId,
        purchase_units: {
            currency:     "GEL",
            total_amount: price,
            total_discount_amount: discount,
            basket: [
                {
                    product_id:  courseId,
                    description: courseTitle,
                    quantity:    1,
                    unit_price:  price,
                    unit_discount_price: discount,
                    image: "",
                },
            ],
        },
        redirect_urls: {
            success: `${baseUrl}/payment/success?order=${shopOrderId}`,
            fail:    `${baseUrl}/payment/fail?order=${shopOrderId}`,
        },
        payment_method: paymentMethods,
        buyer: {
            full_name: userName  || undefined,
            masked_email: userEmail ? maskEmail(userEmail) : undefined,
        },
    }

    const res = await fetch(BOG_ORDER_URL, {
        method: "POST",
        headers: {
            "Content-Type":   "application/json",
            "Authorization":  `Bearer ${token}`,
            "Accept-Language": "ka",
        },
        theme: 'light',
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`BOG order creation failed: ${res.status} — ${err}`)
    }

    const data = await res.json()

    // Persist the BOG order ID
    await pool.query(`
        UPDATE payment_order SET bog_order_id = $1 WHERE shop_order_id = $2
    `, [data.id, shopOrderId])

    return {
        orderId: data.id,
        shopOrderId,
        redirectUrl: data._links.redirect.href,
    }
}

// ─── Callback handler ─────────────────────────────────────────────────────────
/**
 * Handles the async callback POSTed by BOG after payment completion.
 * Place this in src/routes/api/payment/callback.js as a POST handler.
 *
 * BOG posts: { status, order_id, payment_hash, shop_order_id, payment_method, ... }
 */
export async function handleBogCallback(body) {
    const { status, order_id, payment_hash, shop_order_id, payment_method } = body

    // 1. Verify the payment_hash against your stored order
    //    BOG computes: sha256(order_id + shop_order_id + client_secret)
    //    Optionally verify here for extra security — see BOG docs on Callback
    //    For now we trust the status field; add hash verification in production.

    if (status !== "completed") {
        await pool.query(`
            UPDATE payment_order SET status = $1, updated_at = NOW() WHERE shop_order_id = $2
        `, [status, shop_order_id])
        return { ok: true }
    }

    // 2. Look up the order
    const orderResult = await pool.query(`
        SELECT user_id, course_id FROM payment_order WHERE shop_order_id = $1 LIMIT 1
    `, [shop_order_id])

    if (!orderResult.rowCount) {
        console.error("BOG callback: unknown shop_order_id", shop_order_id)
        return { ok: false }
    }

    const { user_id, course_id } = orderResult.rows[0]

    // 3. Grant access — create enrollment
    await pool.query(`
        INSERT INTO enrollment (user_id, course_id, payment_method, enrolled_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, course_id) DO NOTHING
    `, [user_id, course_id, payment_method])

    // 4. Mark order complete
    await pool.query(`
        UPDATE payment_order
        SET status = 'completed', bog_order_id = $1, updated_at = NOW()
        WHERE shop_order_id = $2
    `, [order_id, shop_order_id])

    // 5. Optionally: send confirmation email, push notification, etc.

    return { ok: true }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function maskEmail(email) {
    // BOG requires masked email, e.g. j***@example.com
    const [user, domain] = email.split("@")
    return `${user[0]}***@${domain}`
}