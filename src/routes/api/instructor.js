import { query, json } from "@solidjs/router";
import { pool } from "./db";
import { get_course_level } from "./utils";

export const get_instructor = query(async (slug) => {
    "use server";
    try {
       const data = await pool.query(
  `SELECT
     ip.id,
     ip.user_id,
     ip.bio,
     ip.headline,
     ip.specialization,
     ip.public_slug,
     ip.website_url,
     ip.social_links,
     ip.education,
     ip.work_experience,
     ip.total_students,
     ip.total_courses,
     ip.average_rating,
     ip.created_at,
     u.name,
     u.profile_picture_link,
     COALESCE(
       (SELECT json_agg(
          jsonb_build_object(
            'id', c.id,
            'title', c.title,
            'description', c.description,
            'level', c.level,
            'price', c.price,
            'original_price', c.original_price,
            'thumbnail_url', c.thumbnail_url,
            'total_duration', c.total_duration,
            'total_lessons', c.total_lessons,
            'average_rating', c.average_rating,
            'review_count', c.review_count,
            'enrollment_count', c.enrollment_count,
            'status', c.status,
            'created_at', c.created_at,
            'instructor_name', u.name,
            'instructor_headline', ip.headline,
            'instructor_avatar_url', u.profile_picture_link,
            'instructor_slug', ip.public_slug
          )
          ORDER BY c.created_at DESC
        )
        FROM course c
        WHERE c.instructor_user_id = ip.user_id 
          AND c.status = 'published'
        LIMIT 6
       ),
       '[]'::json
     ) AS courses
   FROM instructor_profile ip
   JOIN "User" u ON u.id = ip.user_id
   WHERE ip.public_slug = $1`,
  [slug]
);


        if (!data.rows.length) return { status: 404, data: null };

        const result = data.rows[0];
        if (result.social_links && typeof result.social_links === 'string') {
            result.social_links = JSON.parse(result.social_links);
        }
        if (result.education && typeof result.education === 'string') {
            result.education = JSON.parse(result.education);
        }
        if (result.work_experience && typeof result.work_experience === 'string') {
            result.work_experience = JSON.parse(result.work_experience);
        }

        const courses = result.courses || [];
        for (let i = 0; i < courses.length; i++) {
            const average_rating = Number(courses[i].average_rating) || 0;
            const original_price = Number(courses[i].original_price);
            const price = Number(courses[i].price);

            if (average_rating) courses[i].hasHalfStar = average_rating % 1 >= 0.25;
            if (original_price > price) {
                courses[i].discount = Math.round((original_price - price) / original_price * 100);
            }
            courses[i].level = get_course_level(courses[i].level);
            courses[i].durationHours = Math.round(courses[i].total_duration / 60 * 10) / 10;
        }

        return {
            status: 200,
            data: {
                ...result,
                courses,
            },
        };
    } catch (err) {
        console.error("[get_instructor]", err);
        return json({ status: 500, data: null }, { status: 500 });
    }
}, "instructor");