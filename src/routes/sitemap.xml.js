'use server'

import { pool } from "./api/db";

export async function GET({ request }) {
  try {
    const courses = await pool.query(`
      SELECT slug, updated_at 
      FROM course 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `);

    const baseUrl = import.meta.env.VITE_URL;
    const date = new Date().toISOString();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/courses</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${courses.rows.map(course => `
  <url>
    <loc>${baseUrl}/course/${course.slug}</loc>
    <lastmod>${new Date(course.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join("")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}