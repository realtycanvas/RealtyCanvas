import { prisma } from '@/lib/prisma';
import { getAllBlogPosts } from '@/lib/sanity/queries';
import SitemapClient from './SitemapClient';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Sitemap - Realty Canvas',
  description: 'Navigate through all pages, projects, and blog posts on Realty Canvas.',
};

export default async function SitemapPage() {
  const [projects, blogPosts] = await Promise.all([
    prisma.project.findMany({
      select: { slug: true, title: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 200, // Limit to recent 200 projects for the HTML sitemap
    }),
    getAllBlogPosts(100), // Limit to recent 100 posts
  ]);

  return <SitemapClient projects={projects} blogPosts={blogPosts} />;
}
