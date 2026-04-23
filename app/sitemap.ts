import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { client, isDevelopmentMode } from '@/lib/sanity/client';

const BASE_URL = 'https://www.realtycanvas.in';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${BASE_URL}/projects`,                            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE_URL}/blog`,                                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE_URL}/gurugram-residential-plots`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE_URL}/about`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/contact`,                             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Active projects — respect per-project SEO indexability and priority
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      seo: { select: { isIndexable: true, sitemapPriority: true } },
    },
  });

  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p) => p.seo?.isIndexable !== false)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: p.seo?.sitemapPriority ?? 0.8,
    }));

  // Blog posts from Sanity — skipped in dev mode (no real Sanity config)
  let blogEntries: MetadataRoute.Sitemap = [];
  if (!isDevelopmentMode) {
    const posts = await client.fetch<{ slug: string; publishedAt: string }[]>(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt
      }`
    );
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  }

  return [...STATIC_ROUTES, ...projectEntries, ...blogEntries];
}
