import { Metadata } from 'next';
import { normalizeBlogSearchQuery } from '@/lib/blog-search';
import { BlogPostPreview } from '@/lib/sanity/types';
import { getAllBlogPosts, getBlogPostCount, getFeaturedBlogPosts } from '@/lib/sanity/queries';
import BlogHero from '@/components/common/blog/blog-hero';
import Breadcrumb from '@/components/ui/breadcrumb';
import JsonLd from '@/components/common/JsonLd';
import FeaturedPost from '@/components/common/blog/feaatured-post';
import BlogListInfinite from '@/components/common/blog/blog-list-infinite';

export const metadata: Metadata = {
  title: 'Blog | RealtyCanvas',
  description: 'Real estate insights, market trends, and expert advice from RealtyCanvas.',
};

async function getFeaturedPosts(): Promise<BlogPostPreview[]> {
  try {
    return await getFeaturedBlogPosts();
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

async function getAllPosts(limit: number, offset: number, search?: string): Promise<BlogPostPreview[]> {
  try {
    return await getAllBlogPosts(limit, offset, search);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams?.q;

  const searchQuery =
    typeof rawQuery === 'string'
      ? rawQuery.trim()
      : Array.isArray(rawQuery) && rawQuery.length > 0
        ? String(rawQuery[0]).trim()
        : '';

  const effectiveSearch = normalizeBlogSearchQuery(searchQuery);

  const pageSize = 12;
  const offset = 0;

  const [featuredPostsRaw, totalCount, allPostsRaw] = await Promise.all([
    getFeaturedPosts(),
    getBlogPostCount(effectiveSearch || undefined),
    getAllPosts(pageSize, offset, effectiveSearch || undefined),
  ]);

  const featuredPosts = featuredPostsRaw.filter((post): post is BlogPostPreview => post != null && post.title != null);

  const posts = allPostsRaw.filter((post): post is BlogPostPreview => post != null && post.title != null);

  const safeTotal = typeof totalCount === 'number' && totalCount > 0 ? totalCount : posts.length;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Reality Canvas Blog',
    description: 'Real estate insights, market trends, and expert advice from RealtyCanvas.',
    url: `${baseUrl}/blog`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Reality Canvas',
      url: baseUrl,
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <Breadcrumb items={[{ label: 'Blog' }]} />
      <JsonLd data={jsonLd} />
      {/* Hero Section */}
      <BlogHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-12 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Featured Stories
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't miss these hand-picked articles from our editorial team
              </p>
            </div>

            <div className="space-y-6 sm:space-y-12">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <FeaturedPost key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're working on bringing you amazing content. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <>
              <BlogListInfinite
                initialPosts={posts}
                totalCount={safeTotal}
                pageSize={pageSize}
                searchQuery={searchQuery || undefined}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
