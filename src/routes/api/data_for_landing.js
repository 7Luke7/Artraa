import { query } from "@solidjs/router";
import { pool } from "./db";
import { generateLandingStructuredData } from "./lib/seo";
import { modify_courses } from "./utils";

export const unauthenticated_landing_data = query(async () => {
    'use server'
    try {
        const get_courses = await pool.query(`
            SELECT
                c.title,
                c.slug,
                c.description,
                c.thumbnail_url,
                c.price,
                c.status,
                c.original_price,
                c.level,
                c.total_duration,
                c.total_lessons,
                c.enrollment_count,
                cc.name AS category_name,
                c.average_rating,
                c.review_count,
                u.name AS instructor_name,
                ip.headline AS instructor_headline,
                u.avatar,
                ip.public_slug AS instructor_slug
            FROM course c
            LEFT JOIN instructor_profile ip ON c.instructor_user_id = ip.user_id
            LEFT JOIN "User" u ON u.id = c.instructor_user_id
            LEFT JOIN course_category cc ON cc.id = c.category_id 
            WHERE status='published'
            ORDER BY c.created_at DESC
            LIMIT 6 
        `)

        if (!get_courses.rowCount) return {ok: false, message: 'კურსების ჩატვირთვა ვერ მოხერხდა'}

        const courses = get_courses.rows

        modify_courses(courses)

        return {
            ok: true,
            courses, 
            structuredData: generateLandingStructuredData(import.meta.env.VITE_URL, courses)
        }
    } catch (error) {
        console.log(error)
        return {ok: false, message: 'დაფიქსირდა შეცდომა კურსების ჩატვირთვისას'}   
    }
}, 'unauthenticated_landing_data')