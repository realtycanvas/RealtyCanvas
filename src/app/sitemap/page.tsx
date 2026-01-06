import { prisma } from '@/lib/prisma';
import { getAllBlogPosts } from '@/lib/sanity/queries';
import SitemapClient from './SitemapClient';

export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic'; // Force dynamic rendering to prevent build-time static generation

export const metadata = {
  title: 'Sitemap - Realty Canvas',
  description: 'Navigate through all pages, projects, and blog posts on Realty Canvas.',
};

export default async function SitemapPage() {
  try {
    const [projects, blogPosts] = await Promise.all([
      prisma.project.findMany({
        select: { slug: true, title: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 200, // Limit to recent 200 projects for the HTML sitemap
      }).catch(err => {
        console.error('Failed to fetch projects for sitemap:', err);
        return [];
      }),
      getAllBlogPosts(100).catch(err => {
        console.error('Failed to fetch blog posts for sitemap:', err);
        return [];
      }),
    ]);

    return <SitemapClient projects={projects} blogPosts={blogPosts} />;
  } catch (error) {
    console.error('Error rendering sitemap page:', error);
    // Return empty state or basic sitemap client if catastrophic failure
    return <SitemapClient projects={[]} blogPosts={[]} />;
  }
}
