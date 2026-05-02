import { query } from "@solidjs/router";
import { pool } from "./db";
import { generateCourseStructuredData } from "./lib/seo";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { redisHGet } from "./lib/redis/hash";
import { get_course_level } from "./utils";

export const get_course_detail = query(async (slug) => {
    'use server'
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");

    const id = getCookie("auth.session-token", cookie);
    try {
        const user_id = await redisHGet(`user:session:${id}`, 'user_id')
        const course = await pool.query(`
            SELECT 
            c.*,
            u.name as instructor_name,
            u.profile_picture_link as instructor_avatar_url,
            ip.bio as instructor_bio,
            ip.headline as instructor_headline,
            ip.public_slug as instructor_slug,
            ip.specialization,
            CASE 
                WHEN $1::uuid IS NOT NULL THEN 
                (SELECT 1 FROM enrollment WHERE course_id = c.id AND user_id = $1 LIMIT 1)
                ELSE NULL 
            END as is_enrolled,
            sections.course_content
            FROM course c
            INNER JOIN "User" u ON c.instructor_user_id = u.id
            LEFT JOIN instructor_profile ip ON u.id = ip.user_id
            LEFT JOIN LATERAL (
                SELECT 
                    COALESCE(
                        JSONB_AGG(
                            JSONB_BUILD_OBJECT(
                                'section_title', cs.title,
                                'section_description', cs.description,
                                'section_created_at', cs.created_at,
                                'section_updated_at', cs.updated_at,
                                'lessons', COALESCE(lesson_agg.lessons, '[]'::jsonb)
                            )
                            ORDER BY cs.section_order
                        ),
                        '[]'::jsonb
                    ) AS course_content
                FROM course_section cs 
                LEFT JOIN LATERAL (
                    SELECT JSONB_AGG(
                        JSONB_BUILD_OBJECT(
                            'lesson_title', cl.title,
                            'lesson_id', cl.id,
                            'is_preview', CASE
                                WHEN cl.id=c.preview_lesson_id THEN TRUE 
                                ELSE FALSE
                            END,  
                            'lesson_description', cl.description,
                            'video_url', cl.video_url,
                            'video_duration', cl.video_duration,
                            'lesson_created_at', cl.created_at,
                            'lesson_updated_at', cl.updated_at
                        )
                        ORDER BY cl.lesson_order
                    ) AS lessons
                    FROM course_lesson cl
                    WHERE cl.section_id = cs.id
                ) lesson_agg ON TRUE
                WHERE cs.course_id = c.id
            ) sections ON TRUE
            WHERE c.slug = $2 AND c.status = 'published'
            LIMIT 1
        `, [user_id, slug]);

        if (!course.rowCount) return {
            ok: false,
            message: "დაფიქსირდა შეცდომა.",
            course: null,
            structuredData: null
        };
        const courses = course.rows[0]

        const average_rating = Number(course['average_rating']) || 0
        courses['original_price'] = Number(courses['original_price'])
        courses['price'] = Number(courses['price'])
        if (average_rating) {
            courses['starRating'] = courses['average_rating']
            courses['hasHalfStar'] = average_rating % 1 >= 0.25
        }

        if (courses['original_price'] > courses['price']) courses['discount'] = Math.round((courses['original_price'] - courses['price']) / courses['original_price'] * 100)
        courses['level'] = get_course_level(courses['level'])
        courses['durationHours'] = Math.round(courses['total_duration'] / 60 * 10) / 10

        return {
            ok: true,
            message: null,
            course: courses,
            structuredData: generateCourseStructuredData(course.rows[0]),
        };
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: "დაფიქსირდა შეცდომა.",
            course: null,
            structuredData: null
        }
    }
}, 'get-course-detail')

export async function get_course_player(slug) {
    try {
        const { request } = getRequestEvent()
        const cookie = request.headers.get("cookie");

        const id = getCookie("auth.session-token", cookie);
        const userId = await redisHGet(`user:session:${id}`, 'user_id')
 
        // 1. Fetch course + lessons from your DB
        const course = await db.course.findUnique({
            where: { slug },
            include: {
                course_content: {
                    orderBy: { position: "asc" },
                    include: {
                        lessons: { orderBy: { position: "asc" } }
                    }
                }
            }
        })
 
        if (!course) return { ok: false, error: "კურსი ვერ მოიძებნა" }
 
        // 2. Check if the user has purchased this course
        const hasPurchase = userId
            ? !!(await db.enrollment.findUnique({
                where: { userId_courseId: { userId, courseId: course.id } }
              }))
            : false
 
        // 3. Build lessons — attach signed URLs only where the user has access
        const course_content = await Promise.all(
            course.course_content.map(async (section) => ({
                ...section,
                lessons: await Promise.all(
                    section.lessons.map(async (lesson) => {
                        const canWatch = lesson.is_preview || hasPurchase
 
                        let video_url = null
                        if (canWatch && lesson.cf_video_id) {
                            video_url = lesson.is_preview
                                ? `https://iframe.cloudflarestream.com/${lesson.cf_video_id}`
                                : await getSignedStreamUrl(lesson.cf_video_id)
                        }
 
                        return {
                            id: lesson.id,
                            lesson_title: lesson.lesson_title,
                            description: lesson.description,
                            is_preview: lesson.is_preview,
                            video_url,
                            video_duration: lesson.video_duration,
                            completed: false, // wire up to a completions table later
                        }
                    })
                )
            }))
        )
 
        return {
            ok: true,
            course: {
                title: course.title,
                slug: course.slug,
                thumbnail_url: course.thumbnail_url,
                price: course.price,
                has_access: hasPurchase,
                course_content,
            }
        }
    } catch (err) {
        console.error("get_course_player error:", err)
        return { ok: false, error: "სერვერის შეცდომა" }
    }
}
 
/**
 * submit_review({ courseSlug, rating, comment })
 *
 * Only runs server-side. Validates that the user has an active enrollment
 * before inserting the review — prevents non-purchasers from reviewing.
 */
export async function submit_review({ courseSlug, rating, comment }) {
    "use server"
 
    const session = await getSession()
    if (!session?.user?.id) throw new Error("უნდა იყოთ ავტორიზებული")
 
    const course = await db.course.findUnique({ where: { slug: courseSlug } })
    if (!course) throw new Error("კურსი ვერ მოიძებნა")
 
    // Gate: must have purchased the course
    const enrollment = await db.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: course.id
            }
        }
    })
    if (!enrollment) throw new Error("კურსი არ გაქვთ შეძენილი")
 
    // Upsert — one review per user per course
    await db.review.upsert({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: course.id
            }
        },
        update: { rating, comment, updatedAt: new Date() },
        create: {
            userId: session.user.id,
            courseId: course.id,
            rating,
            comment,
        }
    })
 
    return { ok: true }
}
 
// ---------------------------------------------------------------------------
// Cloudflare Stream signed URL helper
// ---------------------------------------------------------------------------
 
/**
 * Generates a signed Cloudflare Stream iframe URL that expires in 1 hour.
 *
 * Required env vars:
 *   CF_STREAM_ACCOUNT_ID
 *   CF_STREAM_KEY_ID        (from Stream > Signing Keys)
 *   CF_STREAM_PRIVATE_KEY   (PEM key, base64-encoded in env)
 *
 * Docs: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
 */
async function getSignedStreamUrl(videoId) {
    const accountId = process.env.CF_STREAM_ACCOUNT_ID
    const keyId     = process.env.CF_STREAM_KEY_ID
    const keyData   = process.env.CF_STREAM_PRIVATE_KEY   // base64 PEM
 
    // Decode the private key
    const pemContents = atob(keyData)
        .replace("-----BEGIN RSA PRIVATE KEY-----", "")
        .replace("-----END RSA PRIVATE KEY-----", "")
        .replace(/\s/g, "")
 
    const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        Uint8Array.from(atob(pemContents), c => c.charCodeAt(0)),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    )
 
    const expiry = Math.floor(Date.now() / 1000) + 3600  // 1 hour
 
    // Build the token payload (Cloudflare's format)
    const payload = {
        sub: videoId,
        kid: keyId,
        exp: expiry,
        accessRules: [
            { type: "any", action: "allow" }
        ]
    }
 
    const header  = btoa(JSON.stringify({ alg: "RS256", kid: keyId }))
    const body    = btoa(JSON.stringify(payload))
    const message = `${header}.${body}`
 
    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        new TextEncoder().encode(message)
    )
 
    const token = `${message}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`
 
    return `https://iframe.cloudflarestream.com/${token}`
}

