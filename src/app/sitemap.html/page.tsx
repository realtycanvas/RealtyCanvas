import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAllBlogPosts } from '@/lib/sanity/queries';

export const revalidate = 3600;

export const metadata = {
  title: 'Sitemap | Realty Canvas',
  description: 'Sitemap of Realty Canvas - Find all pages, projects, and blog posts.',
};

export default async function SitemapPage() {
  // Fetch data
  const [projects, blogPosts] = await Promise.all([
    prisma.project.findMany({
      select: { slug: true, title: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    }),
    getAllBlogPosts(1000).then(posts =>
      posts.map(post => ({
        slug: post.slug.current,
        title: post.title,
      }))
    ),
  ]);

  const staticPages = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Sitemap</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Main Pages */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Main Pages</h2>
            <ul className="space-y-2">
              {staticPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-brand-primary hover:underline">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Projects</h2>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:underline">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Blog Posts */}
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Blog Posts</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
