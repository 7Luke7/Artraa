export function GET() {
    const base = process.env.VITE_URL

    const content = `
        User-agent: *
        Allow: /

        # Block private/auth routes from indexing
        Disallow: /account
        Disallow: /account/
        Disallow: /api/
        Disallow: /payment/

        # Block query-string pagination (duplicate content)
        Disallow: /courses?*after=*

        Sitemap: ${base}/sitemap.xml
    `

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
        },
    })
}