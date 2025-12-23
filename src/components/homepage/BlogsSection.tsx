import Link from "next/link";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { BlogPostPreview } from "@/lib/sanity/types";

export default function BlogsSection({ posts }: { posts: BlogPostPreview[] }) {
  return (
    <section className="lg:py-16 py-6 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Latest Blogs
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              Market insights, micromarket breakdowns, and buyer guides from Realty Canvas.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
          >
            View All
            <span aria-hidden>→</span>
          </Link>
        </div>

        {posts.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <BlogPostCard key={post._id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              No posts yet
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              New content is coming soon. Check back shortly.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

