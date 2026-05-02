"use server"
import { query } from "@solidjs/router"
import { pool } from "./db"
import { get_course_level } from "./utils"

const PAGE_SIZE = 16

const SORT_SQL = {
    latest:     "c.created_at DESC, c.id DESC",
    popular:    "c.enrollment_count DESC, c.id DESC",
    rating:     "c.average_rating DESC, c.id DESC",
    price_asc:  "c.price ASC, c.id ASC",
    price_desc: "c.price DESC, c.id DESC",
}

export const get_courses = query(async ({ after, sort, dir }) => {
    const sortSql = SORT_SQL[sort] || SORT_SQL.latest
    const pageSize = PAGE_SIZE + 1 // fetch one extra to know if there's a next page

    // Cursor condition — only apply when paginating forward
    let cursorCondition = ""
    let params = [pageSize]

    if (after) {
        // For DESC sorts we want rows "older" than the cursor
        if (dir === "asc") {
            cursorCondition = `AND c.id > $2`
        } else {
            cursorCondition = `AND c.id < $2`
        }
        params.push(after)
    }

    const result = await pool.query(`
        SELECT
            c.*,
            u.name AS instructor_name
        FROM course c
        INNER JOIN "User" u ON c.instructor_user_id = u.id
        WHERE c.status = 'published'
        ${cursorCondition}
        ORDER BY ${sortSql}
        LIMIT $1
    `, params)

    const rows = result.rows
    const hasNext = rows.length > PAGE_SIZE
    const courses = hasNext ? rows.slice(0, PAGE_SIZE) : rows

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
        lastId: courses.length > 0 ? courses[courses.length - 1].id : null,
        hasNext,
    }
}, "get-courses")