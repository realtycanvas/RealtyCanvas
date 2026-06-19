import { getLatestBlogPosts } from '@/lib/sanity/queries';
import { BlogPostPreview } from '@/lib/sanity/types';
import ViewAllLink from '@/components/ui/view-all-link';
import LatestBlogsCarousel from '@/components/home/latest-blogs-carousel';

export default async function LatestBlogsSection() {
  const postsRaw = await getLatestBlogPosts(8);

  const posts = postsRaw.filter((post): post is BlogPostPreview => post != null && post.title != null);
  if (!posts.length) return null;

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Latest
              <span className="bg-linear-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {' '}
                Blogs
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Market insights, micromarket breakdowns, and buyer guides from Realty Canvas.
            </p>
          </div>
          <ViewAllLink href="/blog" />
        </div>

        <LatestBlogsCarousel posts={posts} />
      </div>
    </section>
  );
}
