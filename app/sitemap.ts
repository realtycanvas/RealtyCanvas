import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { client, isDevelopmentMode } from '@/lib/sanity/client';
import { siteConfig } from '@/lib/site-config';

const BASE_URL = siteConfig.siteUrl;

// ISR: regenerate hourly. DB/CMS fetches below are wrapped in try/catch so the
// build never fails when the data sources are unreachable from the build
// network - static routes still emit.
export const revalidate = 3600;

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFrequency; priority: number }[] = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/projects', changeFrequency: 'daily', priority: 0.9 },
  { path: '/residential-plots-in-gurgaon', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/vedic-city-goa', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookie-policy', changeFrequency: 'yearly', priority: 0.3 },
];

// Active projects - respect per-project SEO indexability and priority.
async function getProjectEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        seo: { select: { isIndexable: true, sitemapPriority: true } },
      },
    });

    return projects
      .filter((p) => p.seo?.isIndexable !== false)
      .map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: p.seo?.sitemapPriority ?? 0.8,
      }));
  } catch (error) {
    console.error('[sitemap] failed to load project entries:', error);
    return [];
  }
}

// Blog posts from Sanity - skipped in dev mode (no real Sanity config).
async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  if (isDevelopmentMode) return [];

  try {
    const posts = await client.fetch<{ slug: string; publishedAt: string; _updatedAt: string }[]>(
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }`
    );

    return posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('[sitemap] failed to load blog entries:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: route.path === '/' ? BASE_URL : `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [projectEntries, blogEntries] = await Promise.all([getProjectEntries(), getBlogEntries()]);

  // Dedupe by URL, keeping the first (static routes win over dynamic).
  const seen = new Set<string>();
  return [...staticEntries, ...projectEntries, ...blogEntries].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
