import { query, json } from "@solidjs/router";
import { pool } from "./db";
import { getAvatarUrl, modify_courses } from "./utils";
import { logError } from "./lib/log"

export const get_instructor = query(async (slug) => {
    "use server";
    try {
        const data = await pool.query(
            `
                SELECT
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
                    u.name,
                    u.avatar,
                    COALESCE(courses_data.courses_json, '{}'::jsonb) AS courses
                FROM instructor_profile ip
                JOIN "User" u ON u.id = ip.user_id
                LEFT JOIN LATERAL (
                    SELECT 
                        jsonb_build_object(
                            'course_count', (SELECT COUNT(*) FROM course WHERE instructor_user_id = ip.user_id AND status = 'published'),
                            'courses', COALESCE(
                                (
                                    SELECT jsonb_agg(
                                        jsonb_build_object(
                                            'id', c.id,
                                            'title', c.title,
                                            'description', c.description,
                                            'level', c.level,
                                            'price', c.price,
                                            'category_name', cat.name,
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
                                            'avatar', u.avatar,
                                            'instructor_slug', ip.public_slug
                                        )
                                        ORDER BY c.created_at DESC
                                    )
                                    FROM (
                                        SELECT 
                                            c2.id,
                                            c2.title,
                                            c2.description,
                                            c2.level,
                                            c2.price,
                                            c2.original_price,
                                            c2.thumbnail_url,
                                            c2.total_duration,
                                            c2.total_lessons,
                                            c2.average_rating,
                                            c2.review_count,
                                            c2.enrollment_count,
                                            c2.status,
                                            c2.created_at,
                                            c2.category_id
                                        FROM course c2
                                        WHERE c2.instructor_user_id = ip.user_id 
                                        AND c2.status = 'published'
                                        ORDER BY c2.created_at DESC
                                        LIMIT 6
                                    ) c
                                    LEFT JOIN course_category cat ON c.category_id = cat.id
                                ),
                                '[]'::jsonb
                            )
                        ) AS courses_json
                ) courses_data ON true
                WHERE ip.public_slug = $1;
            `,
            [slug]
        );


        if (!data.rows.length) return { status: 404, data: null };

        const result = data.rows[0];
        result['avatar'] = getAvatarUrl(result['avatar'])
        if (result.social_links && typeof result.social_links === 'string') {
            result.social_links = JSON.parse(result.social_links);
        }
        if (result.education && typeof result.education === 'string') {
            result.education = JSON.parse(result.education);
        }
        if (result.work_experience && typeof result.work_experience === 'string') {
            result.work_experience = JSON.parse(result.work_experience);
        }

        const courses = result.courses
        modify_courses(courses.courses)

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

export const get_instructor_courses = query(async (page, instructor_id) => {
    'use server'
    try {
        const text = `
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
            LEFT JOIN instructor_profile ip ON ip.user_id = $1
            LEFT JOIN "User" u ON u.id = c.instructor_user_id
            LEFT JOIN course_category cc ON cc.id = c.category_id 
            WHERE status='published'
            ORDER BY c.created_at DESC
            OFFSET $2 LIMIT 6 
        `
        const offset = (page - 1) * 6

        const result = await pool.query(text, [instructor_id, offset])

        modify_courses(result.rows)

        return result.rows        
    } catch (error) {
        logError("instructor", error)
    }
}, 'instructor-courses')