"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { BlogPostPreview } from "@/lib/sanity/types"
import { urlFor } from "@/lib/sanity/client"

interface BlogPostCardProps {
  post: BlogPostPreview
  index?: number
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  const imageUrl = post.mainImage?.asset?.url || urlFor(post.mainImage).url()
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-brand-primary/20 dark:hover:border-brand-primary/30"
    >
      <Link href={`/blog/${post.slug.current}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-brand-primary text-white text-xs font-semibold rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {post.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Author */}
          {post.author && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {post.author.name}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-brand-primary group-hover:gap-2 transition-all duration-300">
                <span className="text-sm font-medium">Read More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}