import { Metadata } from 'next'
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/sanity/queries'
import { BlogPost } from '@/lib/sanity/types'
import BlogHero from '@/components/blog/BlogHero'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogPostCard from '@/components/blog/BlogPostCard'

export const metadata: Metadata = {
  title: 'Blog | RealityCanvas',
  description: 'Real estate insights, market trends, and expert advice from RealityCanvas.',
}

// Revalidate every 60 seconds (ISR) to get fresh blog posts
export const revalidate = 60

// Skeleton loader component
function BlogPostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  )
}

async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    return await getFeaturedBlogPosts()
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    return await getAllBlogPosts()
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const [featuredPosts, allPosts] = await Promise.all([
    getFeaturedPosts(),
    getAllPosts()
  ])

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <BlogHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Stories
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't miss these hand-picked articles from our editorial team
              </p>
            </div>
            
            <div className="space-y-12">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <FeaturedPost key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed with our latest real estate market analysis and expert advice
            </p>
          </div>
          
          {allPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Posts Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're working on bringing you amazing content. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {allPosts.map((post) => (
                  <BlogPostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Load More Button - Placeholder for future pagination */}
              <div className="text-center mt-16">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  disabled
                >
                  Load More Posts
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Pagination coming soon
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}