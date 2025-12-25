import { query } from "@solidjs/router";
import { pool } from "./db";
import { generateCourseStructuredData } from "./lib/seo";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { redisHGet } from "./lib/redis/hash";

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
            u.profile_picture_link as instructor_avatar,
            ip.bio as instructor_bio,
            ip.public_slug as instructor_slug,
            ip.specialization,
            cc.name as category_name,
            cc.slug as category_slug,
            pl.video_url as preview_video_url,
            pl.video_duration as preview_duration,
            pl.title as preview_title,
            cs.title as section_title,
            cs.description as section_description,
            CASE 
                WHEN $1::uuid IS NOT NULL THEN 
                (SELECT 1 FROM enrollment WHERE course_id = c.id AND user_id = $1 LIMIT 1)
                ELSE NULL 
            END as is_enrolled
            FROM course c
            INNER JOIN "User" u ON c.instructor_user_id = u.id
            LEFT JOIN instructor_profile ip ON u.id = ip.user_id
            LEFT JOIN course_category cc ON c.category_id = cc.id
            LEFT JOIN course_lesson pl ON c.preview_lesson_id = pl.id
            LEFT JOIN course_section cs ON cs.course_id = c.id
            WHERE c.slug = $2 AND c.status = 'published'
            LIMIT 1
        `, [user_id, slug]);

        if (!course.rows[0]) return {
            ok: false,
            message: "დაფიქსირდა შეცდომა.",
            course: null,
            structuredData: null
        };

        return {
            ok: true,
            message: null,
            course: course.rows[0],
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