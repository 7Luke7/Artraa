import { pool } from "~/api/db"
const BASE_URL = import.meta.env.VITE_URL || "https://artra.ge"

const STATIC_PAGES = [
    { path: "/",           priority: "1.0", changefreq: "weekly" },
    { path: "/courses",    priority: "0.9", changefreq: "daily"  },
    { path: "/about",      priority: "0.7", changefreq: "monthly" },
    { path: "/contact",    priority: "0.6", changefreq: "monthly" },
    { path: "/terms",      priority: "0.3", changefreq: "yearly"  },
    { path: "/privacy",    priority: "0.3", changefreq: "yearly"  },
    { path: "/cookies",    priority: "0.3", changefreq: "yearly"  },
]

export async function GET() {
    const result = await pool.query(`
        SELECT slug, updated_at
        FROM course
        WHERE status = 'published'
        ORDER BY created_at DESC
    `)

    const now = new Date().toISOString().split("T")[0]

    const staticEntries = STATIC_PAGES.map(page => `
    <url>
        <loc>${BASE_URL}${page.path}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join("")

    const courseEntries = result.rows.map(row => {
        const lastmod = row.updated_at
            ? new Date(row.updated_at).toISOString().split("T")[0]
            : now
        return `
    <url>
        <loc>${BASE_URL}/courses/${row.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
    }).join("")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${courseEntries}
</urlset>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}