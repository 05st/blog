import client from '../client';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
    const baseUrl = {
        development: "http://localhost:3000",
        production: "https://blog.stimsina.com",
    }[process.env.NODE_ENV]
    
    const query = `
        {
            "posts": *[_type == "post"]{slug},
            "authors": *[_type == "author"]{slug},
        }
    `;
    const urls = await client.fetch(query);
    const posts = urls.posts.map(page => {
        return `
            <loc>${baseUrl}/post/${page.slug.current}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.9</priority>
        `;
    });

    const authors = urls.authors.map(page => {
        return `
            <loc>${baseUrl}/author/${page.slug.current}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        `;
    })

    const locs = [...posts,...authors];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${baseUrl}/</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
            </url>
            ${locs 
                .map((loc) => {
                    return `
                        <url>
                            ${loc}
                        </url>
                    `;
                })
                .join("")}
        </urlset>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default Sitemap;