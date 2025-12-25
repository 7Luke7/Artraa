"use server"
import { useSession } from "vinxi/http";

export const oauth_session = async () => {
    const session = await useSession({
        password: process.env.ARTRA_SESSION_SECRET,
        name: 'csrf',
    });

    return session
}