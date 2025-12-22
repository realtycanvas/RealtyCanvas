import { Metadata } from "next"
import Script from "next/script"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from "lucide-react"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"
import BlogPostCard from "@/components/blog/BlogPostCard"
import ShareButton from "@/components/blog/ShareButton"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <img
          src={urlFor(value).width(500).url()}
          alt={value.alt || "Blog post image"}
          className="w-full rounded-lg shadow-lg"
        />
        {value.caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <div className="my-6">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${value.language || 'text'}`}>
            {value.code}
          </code>
        </pre>
      </div>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-primary pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
        <div className="text-gray-800 dark:text-gray-200 italic">
          {children}
        </div>
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary hover:text-brand-secondary underline transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
  },
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | RealityCanvas Blog`,
    description: post.excerpt || `Read ${post.title} on RealityCanvas Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on RealityCanvas Blog`,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const categoryIds = await getBlogPostBySlug(slug).then(post =>
    post?.categories?.map(cat => cat._id) || []
  )

  const [post, relatedPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, categoryIds, 3)
  ])

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const imageUrl = post.mainImage?.asset?.url || (post.mainImage ? urlFor(post.mainImage).url() : '')
  const postUrl = `${baseUrl}/blog/${post.slug.current}`;

  // BlogPosting Schema
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": imageUrl ? [imageUrl] : [],
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt, // Using published as modified since we don't track modified
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Reality Canvas Team",
      "url": post.author?.slug?.current ? `${baseUrl}/author/${post.author.slug.current}` : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "Realty Canvas",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.webp`
      },
      "@id": `${baseUrl}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "url": postUrl
  };

  // BreadcrumbList Schema
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": postUrl
      }
    ]
  };

  const faqItems = Array.isArray((post as any).faqs)
    ? (post as any).faqs.filter((faq: any) => faq && faq.question && faq.answer)
    : [];

  const faqLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen mt-20">
      {/* BlogPosting Schema */}
      <Script
        id="blog-posting-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingLd)
        }}
      />

      {/* BreadcrumbList Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd)
        }}
      />

      {/* FAQPage Schema */}
      {faqLd && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqLd)
          }}
        />
      )}
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category._id}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-secondary-50 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime} min read</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <img
                    src={post.author.image.asset?.url || (post.author.image ? urlFor(post.author.image).width(30).height(30).url() : '')}
                    alt={post.author.image.alt || post.author.name}
                    className="w-5 h-5 rounded-full object-contain"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>By {post.author.name}</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="flex items-center gap-4">
            <ShareButton
              title={post.title}
              text={post.excerpt || undefined}
            />
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.mainImage && imageUrl && (
        <div className="relative h-[500px] overflow-hidden">
          <img
            src={imageUrl}
            alt={post.mainImage.alt || post.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 " />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {post.body && (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                />
              )}
            </article>

            {faqItems.length > 0 && (
              <section className="mt-12 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqItems.map((faq: any, index: number) => (
                    <div
                      key={faq._key || faq.question || index}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio */}
            {post.author && (
              <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                    {post.author.image ? (
                      <img
                        src={post.author.image.asset?.url || (post.author.image ? urlFor(post.author.image).width(128).height(128).url() : '')}
                        alt={post.author.image.alt || post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.author.name}
                    </h3>
                    {post.author.bio && (
                      <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        <PortableText
                          value={post.author.bio}
                          components={portableTextComponents}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 translate-y-20">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-xl  p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Quick Navigation
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <Link href="#" className="block text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">
                    Introduction
                  </Link>
                  <Link href="#" className="block text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">
                    Key Points
                  </Link>
                  <Link href="#" className="block text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors">
                    Conclusion
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-[#F9FAFB] border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogPostCard
                  key={relatedPost._id}
                  post={relatedPost}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
