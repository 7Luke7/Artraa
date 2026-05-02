import { action, json } from "@solidjs/router"
import { get_bog_access_token } from "./authenticate"
import { randomUUID } from "node:crypto"

export const issue_payment_order = action(async (formData) => {
    'use server'
    // check user auth
    if (!(formData instanceof FormData)) return json({
        message: 'არასწორი მონაცემების ფორმატი.',
        field: 'global',
        ok: false,
    }, {status: 400})
    const valid_values = new Set('bog', 'google', 'apple')
    const provider = formData.get('provider') 

    if (!valid_values.has(provider)) return json({
        message: 'არასწორი მონაცემების ფორმატი.',
        field: 'global',
        ok: false,
    }, {status: 400})

    const base_order_body = {
        application_type: "web",
        callback_url: callback_url,
        // 'capture': automatic | manual -- automatic for refund manual for instant
        purchase_units: {
            basket: {
                product_id: 
                description: 
                quantity: 1,
                unit_price: 
                unit_discount_price: 
                vat: 
                vat_percent: 
                total_price:
                image: 
            },
            total_amount: 
            total_discount_amount: 
        },
        redirect_urls: {
            success: '',
            fail: ''
        },
        ttl: 30,
        payment_method: ['card', 'google_pay', 'apple_pay'],
        config: {
            google_pay: {
                google_pay_token: true,
                external: google ? true : false 
            },
            apple_pay: {
                external: apple ? true : false
            }
        /* accont: {} look into that later  */
        }
    }
    const {ok, token} = await get_bog_access_token()
    if (!ok) return {
        ok: false,
        message: 'სერვერული შეცდომა გადახდა ვერ მოხერხდება, გთხოვთ სცადოთ მოგვიანებით'
    }

    try {
        const response = await fetch('https://api.bog.ge/payments/v1/ecommerce/orders', {
            method: "POST",
            headers: {
                'Accept-Language': 'ka',
                'Content-Type': 'application/json',
                'Authorization': token,
                'Theme': 'light',
                'Idempotency-Key': randomUUID()
            },
            body: 
        })    
        
        if (!response.ok) return 
    } catch (error) {
        console.log(error)
    }
}, 'issue-payment')