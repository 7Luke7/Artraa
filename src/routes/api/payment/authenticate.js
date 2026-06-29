'use server'
let token = null
let expires_at = null
let refreshPromise = null
let auth_retries = 2

export const authenticate = async () => {
    try {
        const bog_auth_header = Buffer.from(`Basic <${process.env.BOG_CLIENT_ID}>:<${process.env.BOG_CLIENT_SECRET}>`).toString('base64')
        const response = await fetch('https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': bog_auth_header
            },
            body: "grant_type=client_credentials"
        })

        if (!response.ok) return {
            message: "დაფიქსირდა შეცდომა სერვერზე, ხარვეზი მალე გამოსწორდება.",
            ok: false
        }

        const data = await response.json()
        return {
            ...data,
            ok: true
        }
    } catch (error) {
        return {
            message: "დაფიქსირდა შეცდომა სერვერზე, ხარვეზი მალე გამოსწორდება",
            ok: false
        }
    }
}

export const get_bog_access_token = async () => {
    const BUFFER = 60000
    try {
        if (token && Date.now() < expires_at - BUFFER) return {
            ok: true,
            token: `Bearer <${token}>`
        }

        if (!refreshPromise) {
            refreshPromise = authenticate().then(async (res) => {
                if (!res.ok) {
                    if (auth_retries) await get_bog_access_token()
                    else {
                        return {
                            ok: false,
                            message: 'დაფიქსირდა შეცდომა სერვერზე, ხარვეზი მალე გამოსწორდება.'
                        }
                    }
                    auth_retries--
                }
                const { access_token, expires_in } = res
                token = access_token
                expires_at = Date.now() + expires_in
                auth_retries = 0
                return {
                    ok: true,
                    token: `Bearer ${access_token}`
                }
            })
        }

        return refreshPromise
    } catch (error) {
        console.log(error)
    }
}