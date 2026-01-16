import { action, json, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getCookie, logout_other_devices } from "../../utils";
import { FormDataValidator } from "../../validate/validation-service";
import { pool } from "../../db";
import { hash_password } from "../hash";
import { randomBytes } from "node:crypto"
import { redisHGet } from "../../lib/redis/hash";

export const update_password = action(async (formData) => {
    'use server'
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ ok: false, message: validation_result.message }, {
        status: 400
    })
    const { current_password, new_password, confirm_password } = validation_result.data

    if (new_password !== confirm_password) return json({ ok: false, message: 'პაროლები ერთმანეთს არ ემთხვევა' }, { status: 400 })
    const event = getRequestEvent()
    const cookie = event.request.headers.get('cookie')
    if (!cookie) throw redirect('/login')

    const id = getCookie("auth.session-token", cookie);
    if (!id) throw redirect('/login', {
        status: 303,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const user_id = await redisHGet(`user:session:${id}`, 'user_id')
    if (!user_id) throw redirect('/login', {
        status: 303,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    try {
        const res = await pool.query(`SELECT name, salt, password, id FROM "User" WHERE id = $1`, [user_id]);

        if (!res.rowCount) return json({ ok: false, message: 'არასწორი მონაცემები, სცადეთ ხელახლა.' }, {
            status: 400
        })
        const user = res.rows[0];

        if (!user.password) return json({ ok: false, message: 'პაროლი არ არსებობს.' }, {
            status: 400
        })
        const parameters = {
            message: current_password,
            nonce: Buffer.from(user.salt, 'hex'),
            parallelism: 1,
            tagLength: 32,
            memory: 32768,  // 32 MiB
            passes: 2,
            secret: process.env.ARGON_SECRET
        };

        const user_hash_key = await hash_password(parameters)
        if (!user_hash_key.ok) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        if (user.password !== user_hash_key.key) return json({ ok: false, message: 'პაროლი არასწორია.' }, {
            status: 400
        })

        const salt = randomBytes(16);
        const new_password_parameters = {
            message: new_password,
            nonce: Buffer.from(salt, 'hex'),
            parallelism: 1,
            tagLength: 32,
            memory: 32768,  // 32 MiB
            passes: 2,
            secret: process.env.ARGON_SECRET
        };

        const new_password_hash_key = await hash_password(new_password_parameters)
        if (!new_password_hash_key.ok) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
        const update_password = await pool.query(`
            UPDATE "User"
            SET password=$2, salt=$3
            WHERE id=$1
        `, [user_id, new_password_hash_key.key, salt.toString('hex')])

        if (!update_password.rowCount) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        const device_id = await redisHGet(`user:session:${id}`, 'device_id')
        const logout_others = await logout_other_devices(user_id, id, device_id)
        if (!logout_others) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        return json({
            ok: true,
            message: 'პაროლის შეცვლა წარმატებით დასრულდა.'
        }, {
            status: 200,
            headers: {
                'Set-Cookie': `auth.session-token=${id}; Path=/; Max-Age=${14 * 86400}; HttpOnly; Secure; SameSite=Strict`,
                'Cache-control': 'no-store'
            }
        })
    } catch (error) {
        console.log(error)
        return json({
            ok: false,
            message: 'დაფიuser_id, id, device_idქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
    }
}, 'update-password')

export const set_password = action(async (formData) => {
    'use server'
    const validation_result = FormDataValidator.validateInput(formData)
    if (!validation_result.ok) return json({ ok: false, message: validation_result.message }, {
        status: 400
    })
    const { new_password, confirm_password } = validation_result.data

    if (new_password !== confirm_password) return json({ ok: false, message: 'პაროლები ერთმანეთს არ ემთხვევა' }, { status: 400 })
    const event = getRequestEvent()
    const cookie = event.request.headers.get('cookie')
    if (!cookie) throw redirect('/login')

    const id = getCookie("auth.session-token", cookie);
    if (!id) throw redirect('/login', {
        status: 303,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    const user_id = await redisHGet(`user:session:${id}`, 'user_id')
    if (!user_id) throw redirect('/login', {
        status: 303,
        headers: {
            'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
        }
    })

    try {
        const salt = randomBytes(16);
        const new_password_parameters = {
            message: new_password,
            nonce: Buffer.from(salt, 'hex'),
            parallelism: 1,
            tagLength: 32,
            memory: 32768,  // 32 MiB
            passes: 2,
            secret: process.env.ARGON_SECRET
        };

        const new_password_hash_key = await hash_password(new_password_parameters)
        if (!new_password_hash_key.ok) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
        const update_password = await pool.query(`
            UPDATE "User"
            SET password=$2, salt=$3
            WHERE id=$1
        `, [user_id, new_password_hash_key.key, salt.toString('hex')])

        if (!update_password.rowCount) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        const device_id = await redisHGet(`user:session:${id}`, 'device_id')
        const logout_others = await logout_other_devices(user_id, id, device_id)
        if (!logout_others) return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })

        return json({
            ok: true,
            message: 'პაროლის წარმატებით დაყენდა.'
        }, {
            revalidate: 'get-security-details',
            status: 200,
            headers: {
                'Set-Cookie': `auth.session-token=${id}; Path=/; Max-Age=${14 * 86400}; HttpOnly; Secure; SameSite=Strict`,
            }
        })
    } catch (error) {
        return json({
            ok: false,
            message: 'დაფიქსირდა შეცდომა, სცადეთ ხელახლა.'
        }, {
            status: 500
        })
    }
}, 'set-password')