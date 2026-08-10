'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPostPreview } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';

interface BlogPostCardProps {
  post: BlogPostPreview;
  index?: number;
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  // ✅ Handle both string slug and object slug safely
  const slugValue = typeof post.slug === 'string' ? post.slug : (post.slug?.current ?? null);

  // ✅ No slug = render nothing
  if (!slugValue) return null;

  // ✅ No empty string src
  const imageUrl = post.mainImage?.asset?.url || (post.mainImage ? urlFor(post.mainImage).url() : null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded shadow-lg hover:shadow transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-brand-primary/20 dark:hover:border-brand-primary/30 h-full"
    >
      <Link href={`/blog/${slugValue}`} className="block h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={post.mainImage?.alt || post.title || 'Blog post image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  // ✅ Hide broken image gracefully
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            // ✅ Placeholder when no image
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg
                className="w-12 h-12 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-brand-primary text-white text-xs font-semibold rounded-full shadow-md">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col gap-3">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.slice(0, 2).map((category) => (
                <span
                  key={category._id}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-secondary-50 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-primary transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          {/* {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed text-sm">{post.excerpt}</p>
          )} */}

          {/* Meta - Date + Read Time */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>

          {/* Author + Read More */}
          {post.author && (
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                {post.author.image?.asset?.url ? (
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{post.author.name}</span>
              </div>

              <div className="flex items-center gap-1 text-brand-primary group-hover:gap-2 transition-all duration-300">
                <span className="text-sm font-medium">Read More</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
