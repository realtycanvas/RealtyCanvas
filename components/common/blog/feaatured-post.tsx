'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Star } from 'lucide-react';
import { BlogPostPreview } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';

interface FeaturedPostProps {
  post: BlogPostPreview;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const imageUrl = post.mainImage?.asset?.url || (post.mainImage ? urlFor(post.mainImage).url() : '');

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group bg-white dark:bg-gray-800 rounded shadow-lg hover:shadow transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-brand-primary/20 dark:hover:border-brand-primary/30"
    >
      <Link href={`/blog/${post.slug.current}`} className="block">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 lg:h-full overflow-hidden">
            <img
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent lg:hidden" />

            {/* Featured Badge */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">Featured Article</span>
              </div>
            </div>

            {/* Categories - Mobile */}
            {post.categories && post.categories.length > 0 && (
              <div className="absolute bottom-6 left-6 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  {post.categories.slice(0, 2).map((category) => (
                    <span
                      key={category._id}
                      className="px-3 py-1 text-xs font-medium rounded bg-white/90 text-brand-secondary backdrop-blur-sm"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
            {/* Categories - Desktop */}
            {post.categories && post.categories.length > 0 && (
              <div className="hidden lg:flex flex-wrap gap-2 mb-4">
                {post.categories.slice(0, 3).map((category) => (
                  <span
                    key={category._id}
                    className="px-3 py-1 text-sm font-medium rounded bg-secondary-50 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 line-clamp-3 group-hover:text-brand-primary transition-colors duration-300">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-4 text-sm sm:text-lg leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-500 dark:text-gray-400 mb-5 sm:mb-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
              </div>
            </div>

            {/* Author & CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {post.author && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-brand-primary to-brand-secondary rounded flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-brand-primary group-hover:gap-3 transition-all duration-300">
                <span className="font-semibold">Read More</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
