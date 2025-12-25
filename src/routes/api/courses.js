"use server";
import { json } from "@solidjs/router";
import { pool } from "./db";

class ConstructBrowseLinks {
  constructor(req_url) {
    this.req_url = req_url;
  }

  categories(main, parent, category) {
    return {
      parent: jobs[0][main].some((a) => a["კატეგორია"] === parent)
        ? (() => {
            return jobs[0][main].map((a) => {
              return {
                content: a["კატეგორია"],
                link: `${import.meta.env.VITE_URL}?category=${a["კატეგორია"]}&priceFrom=0&priceTo=2000`,
              };
            });
          })()
        : [],
      child: jobs[0][main].some((a) => a["კატეგორია"] === category)
        ? (() => {
            const found = jobs[0][main].find(
              (pc) => pc["კატეგორია"] === parent
            );
            if (!found) return [];

            return found["სამუშაოები"].map((s) => ({
              content: s,
              link: `${import.meta.env.VITE_URL}?category=${s}&priceFrom=0&priceTo=2000`,
            }));
          })()
        : [],
    };
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
    const baseUrl = `${import.meta.env.VITE_URL}?`;

    let start = Math.max(curr_page - 2, 1);
    let end = start + 4;

    if (end > pageCount) {
      end = pageCount;
      start = Math.max(end - 4, 1);
    }

    let first_course;
    let last_course;
    if (curr_page - 1 > 0) {
      first_course = courses.courses[0];
    }
    if (curr_page + 1 <= pageCount) {
      last_course = courses.courses[courses.courses.length - 1];
    }
    if (curr_page === 1) {
      last_course = courses.courses[courses.courses.length - 1];
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
          overrides["course-pid"] = first_course.publicId;
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
          overrides["course-pid"] = last_course.publicId;
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

    delete mergedParams[`course-${courseKey}`];
    delete mergedParams["course-pid"];
    const last_btn_query = this.buildQueryString(mergedParams, {
      page: `next-skipped_${pageCount}`,
    });
    const first_btn_query = this.buildQueryString(mergedParams, {
      page: `prev-skipped_${1}`,
    });

    return {
      links: links,
      btn_links: [
        `${baseUrl}${first_btn_query}`,
        `${baseUrl}${last_btn_query}`,
      ],
    };
  }
}

export async function GET({ request }) {
  console.log(request)
  const params = {
    category: null,
    priceFrom: 0,
    priceTo: 2000,
    sort: "created_at-DESC",
    page: '1',
    avgrating: null,
  };

  const req_url = new URL(request.url);
  const providedParams = Object.fromEntries(req_url.searchParams.entries());

  const mergedParams = { ...params, ...providedParams };
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(mergedParams)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  }

  const search = "?" + searchParams.toString();

  try {
    let order = null
    const is_skipped = params.page.includes("skipped")
    const is_next = params.page.includes("next")
    const is_prev = params.page.includes("prev")

    let dir = params.sort.split('-')[1];
    const column = params.sort.split('-')[0]

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
      } else {
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

    const allowedColumns = ['price', 'created_at', 'rating_avg'];
    if (!allowedColumns.includes(column)) {
      throw new Error('Invalid column specified');
    }

    order = format(`ORDER BY %I %s, id %s`, column, dir, dir);

    let text = format(`
        SELECT * FROM course c
        `, order)

    let conditions = [];
    let values = [];

    if (category) {
      conditions.push(`$${conditions.length + 1} = ANY(s.categories)`);
      values.push(category);
    }

    if (priceFrom) {
      conditions.push(`s.main_price >= $${conditions.length + 1}`);
      values.push(Number(priceFrom));
    }
    if (priceTo) {
      conditions.push(`s.main_price <= $${conditions.length + 1}`);
      values.push(Number(priceTo));
    }
    
    if (!is_skipped && params[`course-${column}`] && params["course-id"]) {
      let cast = "";
      if (column === "created_at") {
        cast = "::timestamptz";
        params[`service-${column}`] = params[`service-${column}`].replace(" ", "+");
      } else if (column === "main_price") {
        cast = "::numeric";
      }

      conditions.push(
        format(
          "(c.%I, c.id) %s ($%s%s, $%s)",
          column,
          op,
          conditions.length + 1,
          cast,
          conditions.length + 2
        )
      );
      values.push(params[`course-${column}`]);
      values.push(params["course-id"]);
    }

    if (conditions.length > 0) {
      text += `WHERE ${conditions.join(" AND ")}`;
    }

    if (order) {
      text += `\n${order}`                    
    }

    if (is_skipped) {      
      text += `\nLIMIT 16\n`;
      text += `OFFSET ($${conditions.length + 1} - 1) * 16;`
      values.push(Number(page.split("_")[1]))
    } else {
      text += `\nLIMIT 16\n );`;
    }

    const data = await pool.query(text, conditions)

    const { main, parent } = {
      main: postgresql_response.services[0].categories[
        postgresql_response.services[0].categories.length - 2
      ],
      parent:
        postgresql_response.services[0].categories[
          postgresql_response.services[0].categories.length - 1
        ],
    };
    const currentPage =
      Number(mergedParams["page"]) ||
      Number(mergedParams["page"].split("-")[1]) ||
      Number(mergedParams["page"].split("_")[1]);

    const { displayCategories, paginateLinks } = {
      displayCategories: new ConstructBrowseLinks(req_url).categories(
        main,
        parent,
        mergedParams["category"]
      ),
      paginateLinks: new ConstructBrowseLinks(req_url).paginate(
        currentPage,
        mergedParams,
        postgresql_response,
        pageCount,
      ),
    };

    return json({
      ...postgresql_response,
      query: search,
      main,
      links: paginateLinks.links,
      last_btn_link: paginateLinks.btn_links[1],
      first_btn_link: paginateLinks.btn_links[0],
      parent,
      priceFrom: mergedParams["priceFrom"],
      priceTo: mergedParams["priceTo"],
      sort: mergedParams["sort"],
      min_price_filter: 0,
      max_price_filter: 2000,
      category: mergedParams["category"],
      displayCategories,
    });
  } catch (error) {
    console.log("err", error);
  }
}