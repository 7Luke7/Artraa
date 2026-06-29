"use server";
import { json } from "@solidjs/router";
import { ConstructBrowseLinks, get_courses } from "./helpers";
import { modify_courses } from "../utils";

const map_categories = {
  'construction': 'მშენებლობა',
  'technology': 'ტექნოლოგიები',
}

export async function GET({ request }) {
  const params = {
    category: null,
    sort: "created_at-DESC",
    page: 1,
    tsc: 0,
  };

  const req_url = new URL(request.url);
  const providedParams = Object.fromEntries(req_url.searchParams.entries());

  const mergedParams = { ...params, ...providedParams };

  try {
    const {courses, total_count} = await get_courses(mergedParams)

    if (!courses.length) return json({courses: [], ok: false, message: "კურსები ვერ ჩაიტვირთა."}, {status: 400})
    
    let pageCount;
    if (courses[0].total_count) {
      pageCount = Math.ceil(Number(total_count) / 15);
    } else {
      pageCount = Math.ceil(Number(mergedParams['tsc']) / 15);
    }

    const currentPage =
      Number(mergedParams["page"]) ||
      Number(mergedParams["page"].split("-")[1]) ||
      Number(mergedParams["page"].split("_")[1]);

    mergedParams["tsc"] = total_count
    const paginateLinks = new ConstructBrowseLinks(req_url).paginate(
      currentPage,
      mergedParams,
      courses,
      pageCount,
    )

    modify_courses(courses)
    if (!mergedParams['tsc']) delete courses[i]['total_count']

    return json({
      ok: true,
      courses: courses,
      pageCount,
      links: paginateLinks.links,
      left_btn_link: paginateLinks.left_btn_link,
      right_btn_link: paginateLinks.right_btn_link,
      priceFrom: mergedParams["priceFrom"],
      priceTo: mergedParams["priceTo"],
      sort: mergedParams["sort"],
      min_price_filter: 0,
      total_count: mergedParams["tsc"],
      max_price_filter: 5000,
      category: map_categories[mergedParams["category"]],
    }, {status: 200})
  } catch (error) {
    console.log("err", error);
    return json({ok: false, message: "დაფიქსირდა შეცდომა."}, {status: 500})
  }
}
