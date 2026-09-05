'use server'
import format from "pg-format"
import { pool } from "../db";

export const get_courses = async (search) => {
  const {
    category,
    priceFrom,
    priceTo,
    sort,
    page,
    tsc,
  } = search;
  const is_skipped = typeof page === 'string' && page.includes("skipped")
  const is_next = typeof page === 'string' && page.includes("next")
  const is_prev = typeof page === 'string' && page.includes("prev")

  let dir = sort.split('-')[1];
  const column = sort.split('-')[0]

  let op = null;
  if (!is_skipped) {
    if (dir === "DESC") {
      if (is_next) {
        op = "<"
      } else if (is_prev) {
        op = ">"
        dir = "ASC"
      } else {
        op = "<"
      }
    } else if (dir === "ASC") {
      if (is_next) {
        op = ">"
      } else if (is_prev) {
        op = "<"
        dir = "DESC"
      } else {
        op = ">"
      }
    }
  }

  const allowedColumns = ['price', 'created_at', 'enrollment_count', 'average_rating'];
  if (!allowedColumns.includes(column) && !column.startsWith("longitude.")) {
    throw new Error('Invalid column specified');
  }

  const order = format(`ORDER BY c.%I %s, c.slug %s`, column, dir, dir);

  let text = format(`
      SELECT
        c.title,
        c.slug,
        c.description,
        c.thumbnail_url,
        c.price,
        c.status,
        c.original_price,
        c.level,
        c.created_at,
        c.total_duration,
        c.average_rating,
        c.total_lessons,
        c.enrollment_count,
        c.review_count,
        u.name AS instructor_name,
        ip.headline AS instructor_headline,
        avatar,
        ip.public_slug AS instructor_slug%s
      FROM course c
      LEFT JOIN "User" u ON c.instructor_user_id = u.id 
      LEFT JOIN instructor_profile ip ON u.id = ip.user_id
      LEFT JOIN course_category cc ON cc.id = c.category_id
    `,
    !tsc ? ",\n \tCOUNT(*) OVER() AS total_count" : "",
  )

  // Only published courses are public. Every sibling query in the application
  // filters on this - the landing page, the course detail page, the instructor
  // page - but the catalogue listing did not, so unpublished drafts were
  // included in the total and appeared on the last page of the catalogue.
  let conditions = ["c.status = 'published'"];
  let values = [];

  if (category) {
    conditions.push(`$${values.length + 1} = cc.slug`);
    values.push(category);
  }

  if (priceFrom) {
    conditions.push(`c.price >= $${values.length + 1}`);
    values.push(Number(priceFrom));
  }

  if (priceTo) {
    conditions.push(`c.price <= $${values.length + 1}`);
    values.push(Number(priceTo));
  }

  if (search.level) {
    conditions.push(`level = $${values.length + 1}`)
    values.push(search.level)
  }

  // Collected with the other filters rather than appended to `text` after the
  // WHERE clause is built. Appended, it silently attached itself to the last
  // LEFT JOIN's ON clause whenever no other filter was active, so ?offer=sale
  // on its own returned the entire catalogue instead of the discounted courses.
  if (search.offer === "sale") {
    conditions.push("c.original_price > c.price")
  }

  if (!is_skipped) {
    if (is_prev) {
      conditions.push(`c.slug != $${values.length + 1}`)
      values.push(search["course-slug"])
    }

    let base_text = ""

    if (search[`course-${column}`] && search["course-slug"]) {
      base_text = format(
        "(c.%I, c.slug) %s ($%s, $%s)",
        column,
        op,
        values.length + 1,
        values.length + 2
      )
      if (column === "created_at") {
        values.push(new Date(search[`course-${column}`]))
      } else {
        values.push(search[`course-${column}`])
      }
      values.push(search["course-slug"])
      conditions.push(base_text)

    } else if (search[`course-${column}`]) {
      base_text = format("c.%I %s $%s", column, op, values.length + 1)
      if (column === "created_at") {
        values.push(new Date(search[`course-${column}`]))
      } else {
        values.push(search[`course-${column}`])
      }
      conditions.push(base_text)
    }
  }

  if (conditions.length > 0) {
    text += `WHERE ${conditions.join(" AND ")}`;
  }
  if (order) {
    text += `\n${order}`
  }

  if (is_skipped) {
    text += `\nLIMIT 15 OFFSET ($${values.length + 1} - 1) * 15`;
    values.push(Number(page.split("_")[1]))
  } else {
    text += `\nLIMIT 15\n`;
  }

  try {
    const data = await pool.query(text, values);
    if (is_prev && !is_skipped) data.rows.reverse()

    return {
      courses: data.rows,
      total_count: data.rows[0]?.total_count ?? tsc
    }
  } catch (error) {
    console.log(error);
  }
};

export class ConstructBrowseLinks {
  constructor(req_url) {
    this.req_url = req_url;
  }
  buildQueryString(baseParams, overrides = {}) {
    const finalParams = { ...baseParams, ...overrides };

    const parts = [];
    for (const key in finalParams) {
      if (finalParams[key] !== undefined && finalParams[key] !== null) {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(finalParams[key])}`
        );
      }
    }
    return parts.join("&");
  }

  paginate(curr_page, mergedParams, courses, pageCount) {
    const links = [];
    const baseUrl = `${import.meta.env.VITE_URL}/courses?`;

    let start = Math.max(curr_page - 2, 1);
    let end = start + 4;

    if (end > pageCount) {
      end = pageCount;
      start = Math.max(end - 4, 1);
    }

    let first_course;
    let last_course;
    if (curr_page - 1 > 0) {
      first_course = courses[0];
    }
    if (curr_page + 1 <= pageCount || curr_page === 1) {
      last_course = courses[courses.length - 1];
    }

    const courseKey = mergedParams["sort"].split("-")[0];

    for (let i = start; i <= end; i++) {
      if (i < curr_page) {
        const overrides = {};
        if (i + 1 !== curr_page) {
          overrides.page = `prev-skipped_${i}`;
        } else {
          overrides.page = `prev-${i}`;
          overrides[`course-${courseKey}`] = first_course[courseKey];
          overrides["course-slug"] = first_course.slug;
        }

        const queryString = this.buildQueryString(mergedParams, overrides);

        links.push({
          page: i,
          link: `${baseUrl}${queryString}`,
          active: i === curr_page,
        });
      } else if (i > curr_page) {
        const overrides = {};
        if (i - 1 !== curr_page) {
          overrides.page = `next-skipped_${i}`;
        } else {
          overrides.page = `next-${i}`;
          overrides[`course-${courseKey}`] = last_course[courseKey];
          overrides["course-slug"] = last_course.slug;
        }
        const queryString = this.buildQueryString(mergedParams, overrides);
        links.push({
          page: i,
          link: `${baseUrl}${queryString}`,
          active: i === curr_page,
        });
      } else {
        links.push({
          page: i,
          link: null,
          active: i === curr_page,
        });
      }
    }

    const data = {
      links,
      right_btn_link: null,
      left_btn_link: null,
    }

    if (curr_page + 1 <= pageCount) {
      const overrides = {};
      overrides[`course-${courseKey}`] = last_course[courseKey];
      overrides["course-slug"] = last_course.slug;
      overrides['page'] = `next-${curr_page + 1}`

      const right_btn_query = this.buildQueryString(mergedParams, overrides);

      data['right_btn_link'] = `${baseUrl}${right_btn_query}`
    }
    if (curr_page - 1 > 0) {
      const overrides = {};
      overrides[`course-${courseKey}`] = first_course[courseKey];
      overrides["course-slug"] = first_course.slug;
      overrides['page'] = `prev-${curr_page - 1}`

      const left_btn_query = this.buildQueryString(mergedParams, overrides);

      data["left_btn_link"] = `${baseUrl}${left_btn_query}`
    }
    return data
  }
}