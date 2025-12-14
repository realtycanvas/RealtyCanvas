import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllBlogPosts } from '@/lib/sanity/queries';

export const revalidate = 3600; // Cache for 1 hour

const BASE_URL = 'https://www.realtycanvas.in';

// Static pages that should be included in sitemap
const staticPages = [
  '',
  '/projects',
  '/blog',
  '/about',
  '/contact',
  '/services',
];

export async function GET() {
  try {
    console.log('Generating fresh sitemap...');

    // Use Promise.allSettled to prevent one failure from blocking the other
    const [projectsResult, blogPostsResult] = await Promise.allSettled([
      // Fetch projects with timeout and limit
      Promise.race([
        prisma.project.findMany({
          select: {
            slug: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1000, // Limit to prevent excessive queries
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Projects query timeout')), 5000)
        )
      ]),
      
      // Fetch blog posts with timeout
      Promise.race([
        getAllBlogPosts(50).then(posts => 
          posts.map(post => ({
            slug: post.slug.current,
            publishedAt: post.publishedAt,
          }))
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Blog posts query timeout')), 3000)
        )
      ])
    ]);

    // Extract results with fallbacks
    const projects = projectsResult.status === 'fulfilled' 
      ? (projectsResult.value as Array<{ slug: string; updatedAt: Date }>)
      : [];
      
    const blogPosts = blogPostsResult.status === 'fulfilled' 
      ? (blogPostsResult.value as Array<{ slug: string; publishedAt: string }>)
      : [];

    // Log any failures
    if (projectsResult.status === 'rejected') {
      console.warn('Failed to fetch projects for sitemap:', projectsResult.reason);
    }
    if (blogPostsResult.status === 'rejected') {
      console.warn('Failed to fetch blog posts for sitemap:', blogPostsResult.reason);
    }

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${projects
    .map(
      (project) => `
  <url>
    <loc>${BASE_URL}/projects/${project.slug}</loc>
    <lastmod>${project.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('')}
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${(() => {
      try {
        const date = new Date(post.publishedAt);
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return new Date().toISOString();
        }
        return date.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    })()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    console.log(`Sitemap generated with ${projects.length} projects and ${blogPosts.length} blog posts`);

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap with just static pages if there's an error and no cache
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Shorter cache for error case
      },
    });
  }
}