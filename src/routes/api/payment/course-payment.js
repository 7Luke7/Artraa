/**
 * src/api/course-payment.js
 *
 * SolidStart server action — called from the Buy button on the course detail page.
 * Returns the BOG redirect URL which the client immediately navigates to.
 */

import { action } from "@solidjs/router"
// import { getRequestEvent } from "solid-js/web"
// import { getCookie } from "vinxi/http"
// import { createBogOrder } from "./payment"
// import { redisHGet } from "../lib/redis/hash"
// import { pool } from "../db"

export const initiate_purchase = action(async (courseSlug) => {
    "use server"

    console.log("course-slug", courseSlug)
    // const { request } = getRequestEvent()
    // const cookie = request.headers.get("cookie")
    // const sessionId = getCookie("auth.session-token", cookie)

    // if (!sessionId) {
    //     // Not logged in — redirect to login with return URL
    //     throw redirect(`/auth/login?next=/courses/${courseSlug}`)
    // }

    // const userId = await redisHGet(`user:session:${sessionId}`, "user_id")
    // if (!userId) throw redirect(`/auth/login?next=/courses/${courseSlug}`)

    // // Fetch course + user
    // const [courseResult, userResult] = await Promise.all([
    //     pool.query(
    //         `SELECT id, title, slug, price FROM course WHERE slug = $1 AND status = 'published' LIMIT 1`,
    //         [courseSlug]
    //     ),
    //     pool.query(
    //         `SELECT id, name, email FROM "User" WHERE id = $1 LIMIT 1`,
    //         [userId]
    //     ),
    // ])

    // if (!courseResult.rowCount) throw new Error("კურსი ვერ მოიძებნა")

    // const course = courseResult.rows[0]
    // const user   = userResult.rows[0]

    // // Check if already enrolled
    // const alreadyEnrolled = await pool.query(
    //     `SELECT 1 FROM enrollment WHERE user_id = $1 AND course_id = $2 LIMIT 1`,
    //     [userId, course.id]
    // )
    // if (alreadyEnrolled.rowCount) {
    //     throw redirect(`/course/${courseSlug}`)
    // }

    // // Create the BOG order
    // const { redirectUrl } = await createBogOrder({
    //     courseId:    course.id,
    //     courseSlug:  course.slug,
    //     courseTitle: course.title,
    //     price:       Number(course.price),
    //     userId,
    //     userEmail:   user.email,
    //     userName:    user.name,
    // })

    // // Redirect to BOG payment page
    // throw redirect(redirectUrl)
}, "initiate-purchase")