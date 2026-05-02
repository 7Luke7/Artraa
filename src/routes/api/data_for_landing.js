import { query } from "@solidjs/router";
import { pool } from "./db";
import { get_course_level } from "./utils";
import { generateLandingStructuredData } from "./lib/seo";

export const unauthenticated_landing_data = query(async () => {
    'use server'
    try {
        const get_courses = await pool.query(`
            SELECT
             c.*,
             u.name AS instructor_name,
             ip.headline AS instructor_headline,
             u.profile_picture_link AS instructor_avatar_url,
             ip.public_slug AS instructor_slug
            FROM course c
            LEFT JOIN instructor_profile ip ON c.instructor_user_id = ip.user_id
            LEFT JOIN "User" u ON u.id = c.instructor_user_id
            WHERE status='published'
            ORDER BY created_at DESC
            LIMIT 6 
        `)

        if (!get_courses.rowCount) return {ok: false, message: 'კურსების ჩატვირთვა ვერ მოხერხდა'}

        const courses = get_courses.rows

        for (let i = 0; i < courses.length; i++) {
            const average_rating = Number(courses[i]['average_rating']) || 0
            const original_price = Number(courses[i]['original_price']) 
            const price = Number(courses[i]['price'])

            if (average_rating) courses[i]['hasHalfStar'] = average_rating % 1 >= 0.25

            if (original_price > price) courses[i]['discount'] = Math.round((original_price - price) / original_price * 100)
            courses[i]['level'] = get_course_level(courses[i]['level'])
            courses[i]['durationHours'] = Math.round(courses[i]['total_duration'] / 60 * 10) / 10
        } 

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