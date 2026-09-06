import { getRequestEvent } from "solid-js/web";
import { query, redirect } from "@solidjs/router";
import { redisExists } from "../lib/redis/basic";
import { redisHGet } from "../lib/redis/hash";
import { getAvatarUrl, modify_courses, retreiveCookie } from "../utils";
import { pool } from "../db";
import { logError } from "../lib/log"

export const get_user = query(async () => {
  'use server'
  try {
    const { request } = getRequestEvent()
    const cookie = request.headers.get("cookie");
    if (!cookie) return { status: 401 }

    const id = retreiveCookie("auth.session-token", cookie);
    if (!id) return { status: 401 }

    const auth = await redisExists(`user:session:${id}`)
    if (!auth) return { status: 401 }
    const firstname = await redisHGet(`user:session:${id}`, 'firstname')

    return firstname
  } catch (error) {
    logError("user/landing", error)
  }
}, 'get-user')

export const get_header = query(async () => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get("cookie");
  if (!cookie) return { status: 401 }

  const id = retreiveCookie("auth.session-token", cookie);
  if (!id) return { status: 401 }

  try {
    const auth = await redisExists(`user:session:${id}`)
    if (!auth) return { status: 401 }

    const data = await redisHGet(`user:session:${id}`, 'pfp')
    if (!data) return { status: 200 }
    const avatar = getAvatarUrl(data)

    return { status: 200, avatar }
  } catch (error) {
    logError("user/landing", error)
  }
}, 'get-user-header')

export const getUserCourses = query(async (userId) => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get("cookie");
  if (!cookie) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  const session_id = retreiveCookie("auth.session-token", cookie);
  if (!session_id) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  const auth = await redisExists(`user:session:${session_id}`)
  if (!auth) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  try {
    const data = await redisHGet(`user:session:${session_id}`, 'user_id')
    if (!data) throw redirect('/login')
    const get_courses = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.thumbnail_url,
        c.total_duration,
        c.total_lessons,
        c.level,
        e.progress_percentage,
        e.last_accessed_at,
        u.name as instructor_name,
        cc.name AS category_name,
        u.avatar,
        e.enrolled_at,
        (
          SELECT COALESCE(AVG(rating), 0)
          FROM course_review cr
          WHERE cr.course_id = c.id
        ) as rating
      FROM enrollment e
      JOIN course c ON e.course_id = c.id
      JOIN "User" u ON c.instructor_user_id = u.id
      JOIN course_category cc ON cc.id = c.category_id 
      WHERE e.user_id = $1 AND c.status = 'published'
      ORDER BY e.enrolled_at DESC
    `, [userId])

    const courses = get_courses.rows

    modify_courses(courses)

    return courses
  } catch (error) {
    console.error(error)
    return []
  }
}, 'user-courses')

export const getRecommendations = query(async (userId) => {
  'use server'
  const { request } = getRequestEvent()
  const cookie = request.headers.get("cookie");
  if (!cookie) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  const session_id = retreiveCookie("auth.session-token", cookie);
  if (!session_id) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  const auth = await redisExists(`user:session:${session_id}`)
  if (!auth) throw redirect('/login', {
    status: 302,
    headers: {
      'Set-Cookie': 'auth.session-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict',
    }
  })
  try {
    const data = await redisHGet(`user:session:${session_id}`, 'user_id')
    if (!data) throw redirect('/login')
    const get_recommendations = await pool.query(`
      WITH user_categories AS (
        SELECT DISTINCT c.category_id
        FROM enrollment e
        JOIN course c ON e.course_id = c.id
        WHERE e.user_id = $1 AND c.category_id IS NOT NULL
      ),
      user_levels AS (
        SELECT DISTINCT c.level
        FROM enrollment e
        JOIN course c ON e.course_id = c.id
        WHERE e.user_id = $1
      )
      SELECT 
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        c.average_rating,
        c.price,
        c.status,
        cc.name AS category_name,
        c.original_price,
        c.level,
        c.total_duration,
        c.total_lessons,
        c.enrollment_count,
        c.review_count,
        u.name AS instructor_name,
        ip.headline AS instructor_headline,
        u.avatar,
        ip.public_slug AS instructor_slug
      FROM course c
      JOIN "User" u ON c.instructor_user_id = u.id
      LEFT JOIN instructor_profile ip ON u.id = ip.user_id
      LEFT JOIN course_category cc ON cc.id = c.category_id 
      WHERE c.status = 'published'
        AND c.id NOT IN (
          SELECT course_id FROM enrollment WHERE user_id = $1
        )
      ORDER BY 
        CASE 
          WHEN c.category_id IN (SELECT category_id FROM user_categories) THEN 1
          WHEN c.level = ANY(SELECT level FROM user_levels) THEN 2
          ELSE 3
        END,
        c.enrollment_count DESC
      LIMIT 6
    `, [userId])
    const courses = get_recommendations.rows

    modify_courses(courses)

    return courses
  } catch (error) {
    console.error(error)
    return []
  }
}, 'course-recommendations')