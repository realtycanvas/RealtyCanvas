'use client'

import { useCallback, useEffect, useState } from 'react'
import { BlogPostPreview } from '@/lib/sanity/types'
import BlogPostCard from '@/components/blog/BlogPostCard'
import InfiniteScroll from '@/components/ui/InfiniteScroll'

interface BlogListInfiniteProps {
  initialPosts: BlogPostPreview[]
  totalCount: number
  pageSize: number
  searchQuery?: string
}

export default function BlogListInfinite({
  initialPosts,
  totalCount,
  pageSize,
  searchQuery,
}: BlogListInfiniteProps) {
  const [posts, setPosts] = useState<BlogPostPreview[]>(initialPosts)
  const [offset, setOffset] = useState(initialPosts.length)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length < totalCount)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPosts(initialPosts)
    setOffset(initialPosts.length)
    setHasMore(initialPosts.length < totalCount)
    setError(null)
  }, [initialPosts, totalCount, searchQuery])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('offset', String(offset))
      params.set('limit', String(pageSize))
      if (searchQuery && searchQuery.trim().length > 0) {
        params.set('q', searchQuery.trim())
      }

      const response = await fetch(`/api/blogs?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load more posts')
      }

      const data: {
        posts: BlogPostPreview[]
        totalCount: number
        hasMore: boolean
      } = await response.json()

      const newPosts = Array.isArray(data.posts) ? data.posts : []
      if (newPosts.length === 0) {
        setHasMore(false)
        return
      }

      setPosts((prev) => [...prev, ...newPosts])

      const newOffset = offset + newPosts.length
      setOffset(newOffset)

      const updatedTotal =
        typeof data.totalCount === 'number' && data.totalCount > 0
          ? data.totalCount
          : totalCount

      if (newOffset >= updatedTotal) {
        setHasMore(false)
      }
    } catch (err) {
      setError('Unable to load more articles right now.')
    } finally {
      setLoading(false)
    }
  }, [offset, pageSize, searchQuery, loading, hasMore, totalCount])

  const shownCount = posts.length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing{' '}
          <span className="font-semibold">
            {shownCount === 0 ? 0 : 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold">
            {shownCount}
          </span>{' '}
          of{' '}
          <span className="font-semibold">
            {totalCount}
          </span>{' '}
          articles
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        loadingComponent={
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary" />
            <span className="text-sm">Loading more articles...</span>
          </div>
        }
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogPostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

