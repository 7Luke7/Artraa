import { action, redirect } from "@solidjs/router"
import { getRequestEvent } from "solid-js/web"
import { createBogOrder } from "./payment"
import { redisHGet } from "../lib/redis/hash"
import { pool } from "../db"
import { retreiveCookie } from "../utils"

export const initiate_purchase = action(async (courseSlug) => {
    "use server"
    try {
        const { request } = getRequestEvent()
        const cookie = request.headers.get("cookie")
        const sessionId = retreiveCookie("auth.session-token", cookie)

        if (!sessionId) throw redirect(`/login?next=/course/${courseSlug}`)

        const userId = await redisHGet(`user:session:${sessionId}`, "user_id")
        if (!userId) throw redirect(`/login?next=/course/${courseSlug}`)

        const [courseResult, userResult] = await Promise.all([
            pool.query(
                `SELECT id, title, slug, price FROM course WHERE slug = $1 AND status = 'published' LIMIT 1`,
                [courseSlug]
            ),
            pool.query(
                `SELECT id, name, email FROM "User" WHERE id = $1 LIMIT 1`,
                [userId]
            ),
        ])

        if (!courseResult.rowCount) throw new Error("კურსი ვერ მოიძებნა")

        const course = courseResult.rows[0]
        const user = userResult.rows[0]

        const alreadyEnrolled = await pool.query(
            `SELECT 1 FROM enrollment WHERE user_id = $1 AND course_id = $2 LIMIT 1`,
            [userId, course.id]
        )
        if (alreadyEnrolled.rowCount) {
            throw redirect(`/course/${courseSlug}`)
        }

        const { redirectUrl } = await createBogOrder({
            courseId: course.id,
            courseSlug: course.slug,
            courseTitle: course.title,
            price: Number(course.price),
            userId,
            userEmail: user.email,
            userName: user.name,
        })

        throw redirect(redirectUrl)
    } catch (error) {
        console.log(error)
        if (error instanceof Response) throw error;
    }
}, "initiate-purchase")