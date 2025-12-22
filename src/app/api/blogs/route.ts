import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPosts, getBlogPostCount } from '@/lib/sanity/queries'
import { normalizeBlogSearchQuery } from '@/lib/blog-search'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const offsetParam = searchParams.get('offset')
    const limitParam = searchParams.get('limit')
    const rawOffset = offsetParam ? parseInt(offsetParam, 10) : 0
    const rawLimit = limitParam ? parseInt(limitParam, 10) : 12

    const offset = Number.isNaN(rawOffset) || rawOffset < 0 ? 0 : rawOffset
    const limitBase = Number.isNaN(rawLimit) || rawLimit <= 0 ? 12 : rawLimit
    const limit = Math.min(limitBase, 50)

    const q = searchParams.get('q')
    const normalized = q && q.trim().length > 0 ? normalizeBlogSearchQuery(q) : ''
    const search = normalized.length > 0 ? normalized : undefined

    const [posts, totalCount] = await Promise.all([
      getAllBlogPosts(limit, offset, search),
      getBlogPostCount(search),
    ])

    const safeTotal =
      typeof totalCount === 'number' && totalCount > 0
        ? totalCount
        : offset + posts.length

    const hasMore = offset + posts.length < safeTotal

    return NextResponse.json({
      posts,
      totalCount: safeTotal,
      hasMore,
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      {
        posts: [],
        totalCount: 0,
        hasMore: false,
        error: 'Failed to load blog posts',
      },
      { status: 500 }
    )
  }
}
