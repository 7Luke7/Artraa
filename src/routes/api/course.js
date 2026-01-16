import { query } from "@solidjs/router";
import { pool } from "./db";
import { generateCourseStructuredData } from "./lib/seo";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { redisHGet } from "./lib/redis/hash";
import { get_course_level } from "./utils";

export const get_course_detail = query(async (slug) => {
    'use server'
    console.log(slug)
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
            cc.name as category_name,
            cc.slug as category_slug,
            (
                SELECT JSONB_BUILD_OBJECT(
                    'parent_category_name', ccp.name,
                    'parent_category_slug', ccp.slug
                ) FROM course_category ccp
                WHERE cc.parent_id = ccp.id
            ) AS cp,
            CASE 
                WHEN $1::uuid IS NOT NULL THEN 
                (SELECT 1 FROM enrollment WHERE course_id = c.id AND user_id = $1 LIMIT 1)
                ELSE NULL 
            END as is_enrolled,
            sections.course_content
            FROM course c
            INNER JOIN "User" u ON c.instructor_user_id = u.id
            LEFT JOIN instructor_profile ip ON u.id = ip.user_id
            LEFT JOIN course_category cc ON c.category_id = cc.id
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
            courses[i]['hasHalfStar'] = average_rating % 1 >= 0.25
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

export const recommended_courses = query(async (data) => {
    'use server'
    try {
        const [cc_slug, pc_slug, course_slug] = [data[0], data[1], data[2]]
        const query_courses = await pool.query(`
           SELECT 
                cc.name AS category_name,
                c.*,
                u.name AS instructor_name,
                ip.headline AS instructor_headline,
                u.profile_picture_link AS instructor_avatar_url,
                ip.public_slug AS instructor_slug
            FROM course c
            INNER JOIN course_category cc ON cc.id = c.category_id OR cc.slug = $2
            LEFT JOIN instructor_profile ip ON c.instructor_user_id = ip.user_id
            LEFT JOIN "User" u ON u.id = c.instructor_user_id
            WHERE c.status = 'published' AND c.slug != $3 AND (cc.slug = $1 OR cc.slug = $2)
            ORDER BY 
                CASE 
                    WHEN cc.slug = $1 THEN 1
                    WHEN cc.slug = $2 THEN 2
                END,
                c.created_at DESC 
            LIMIT 8
        `, [cc_slug, pc_slug, course_slug])

        if (!query_courses.rowCount) return { ok: false, message: 'კურსების ჩატვირთვა ვერ მოხერხდა' }

        const courses = query_courses.rows

        for (let i = 0; i < courses.length; i++) {
            const original_price = Number(courses[i]['original_price'])
            const price = Number(courses[i]['price'])

            if (original_price > price) courses[i]['discount'] = Math.round((original_price - price) / original_price * 100)
            courses[i]['level'] = get_course_level(courses[i]['level'])
            courses[i]['durationHours'] = Math.round(courses[i]['total_duration'] / 60 * 10) / 10
        }

        return courses
    } catch (error) {
        console.log(error)
    }
})