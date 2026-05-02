import { argon2 } from "node:crypto"

export const hash_password = (parameters) => {
    return new Promise((res, rej) => {
        argon2('argon2id', parameters, (err, derived_key) => {
            if (err) return rej({ok: false, err})
            return res({ok: true, key: derived_key.toString('hex')})
        })
    })
}