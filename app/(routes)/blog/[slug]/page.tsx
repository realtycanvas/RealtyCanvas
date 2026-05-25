import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import ShareButton from '@/components/common/blog/share-button';
import Breadcrumb from '@/components/ui/breadcrumb';
import TableOfContents from '@/components/common/blog/table-of-contents';
import BlogPostCard from '@/components/common/blog/blog-post-card';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-4 sm:my-8">
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || 'Blog post image'}
          className="w-full max-w-full rounded-lg shadow-lg"
        />
        {value.caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">{value.caption}</p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <div className="my-3 sm:my-6 max-w-full overflow-x-auto">
        <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg min-w-0">
          <code className={`language-${value.language || 'text'}`}>{value.code}</code>
        </pre>
      </div>
    ),
    table: ({ value }: any) => {
      const rows = value.rows || [];
      return (
        <div className="my-4 sm:my-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                  {row.cells.map((cell: string, cellIndex: number) => {
                    const CellTag = rowIndex === 0 ? 'th' : 'td';
                    return (
                      <CellTag
                        key={cellIndex}
                        className={`px-3 sm:px-6 py-2 sm:py-4 text-sm ${
                          rowIndex === 0
                            ? 'font-semibold text-gray-900 dark:text-white text-left'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {cell}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    projectSnapshot: ({ value }: any) => {
      const title = value.title || 'Project Snapshot';
      let rows: any[] = [];

      // Parse JSON data
      try {
        if (value.jsonData) {
          rows = JSON.parse(value.jsonData);
        } else {
          console.error('No jsonData found in value');
        }
      } catch (e) {
        console.error('Failed to parse projectSnapshot JSON:', e);
      }

      if (rows.length === 0) {
        return null;
      }
      return (
        <div className="my-4 sm:my-8">
          {title && <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{title}</h3>}
          <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rows.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 w-1/3 border-r border-gray-200 dark:border-gray-700">
                      {row.field}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 text-sm text-gray-700 dark:text-gray-300">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-5 sm:mt-8 mb-3 sm:mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mt-4 sm:mt-6 mb-2 sm:mb-3">{children}</h3>
    ),
    normal: ({ children }: any) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-primary pl-4 sm:pl-6 py-2 my-4 sm:my-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
        <div className="text-gray-800 dark:text-gray-200 italic">{children}</div>
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <Link
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary hover:text-brand-secondary underline transition-colors"
      >
        {children}
      </Link>
    ),
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>
    ),
  },
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | RealtyCanvas Blog`,
    description: post.excerpt || `Read ${post.title} on RealtyCanvas Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on RealtyCanvas Blog`,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const categoryIds = await getBlogPostBySlug(slug).then((post) => post?.categories?.map((cat) => cat._id) || []);

  const [post, relatedPosts] = await Promise.all([getBlogPostBySlug(slug), getRelatedBlogPosts(slug, categoryIds, 3)]);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const imageUrl = post.mainImage?.asset?.url || (post.mainImage ? urlFor(post.mainImage).url() : '');
  const postUrl = `${baseUrl}/blog/${post.slug.current}`;

  const ytId = extractYouTubeId(post.youtubeUrl);
  const embedUrl = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`
    : null;

  // BlogPosting Schema
  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Realty Canvas Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Realty Canvas',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.webp`,
      },
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
  };

  // BreadcrumbList Schema
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  // Parse FAQs from JSON or legacy array format
  let faqItems: any[] = [];
  try {
    if ((post as any).faqsJson) {
      faqItems = JSON.parse((post as any).faqsJson);
    } else if (Array.isArray((post as any).faqs)) {
      faqItems = (post as any).faqs;
    }
    faqItems = faqItems.filter((faq: any) => faq && faq.question && faq.answer);
  } catch (e) {
    console.error('Failed to parse FAQs:', e);
    faqItems = [];
  }

  const faqLd =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen mt-20">
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
      {/* BlogPosting Schema */}
      <Script
        id="blog-posting-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingLd),
        }}
      />

      {/* BreadcrumbList Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />

      {/* FAQPage Schema */}
      {faqLd && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqLd),
          }}
        />
      )}
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors mb-4 sm:mb-8 group"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">{post.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
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
                <Clock className="w-5 h-5" />
                <span>{post.readTime} min read</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <img
                    src={
                      post.author.image.asset?.url ||
                      (post.author.image ? urlFor(post.author.image).width(30).height(30).url() : '')
                    }
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
            <ShareButton title={post.title} text={post.excerpt || undefined} />
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.mainImage && imageUrl && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-52 sm:h-80 lg:h-125 overflow-hidden rounded">
            <img src={imageUrl} alt={post.mainImage.alt || post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            <article className="prose sm:prose-lg dark:prose-invert max-w-none prose-table:block prose-table:overflow-x-auto prose-table:max-w-full">
              {post.body && <PortableText value={post.body} components={portableTextComponents} />}
            </article>

            {/* Mobile/Tablet inline video (hidden on lg+ where it shows in the sidebar) */}
            {embedUrl && (
              <div className="lg:hidden mt-8 sm:mt-12">
                <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700 p-2">
                  <div className="relative w-50 sm:w-56 aspect-9/16 mx-auto bg-black rounded overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title="Featured video"
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {faqItems.length > 0 && (
              <section className="mt-8 sm:mt-12 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqItems.map((faq: any, index: number) => (
                    <div
                      key={faq._key || faq.question || index}
                      className="border border-gray-200 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio */}
            {post.author && (
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                    {post.author.image ? (
                      <img
                        src={
                          post.author.image.asset?.url ||
                          (post.author.image ? urlFor(post.author.image).width(128).height(128).url() : '')
                        }
                        alt={post.author.image.alt || post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.author.name}</h3>
                    {post.author.bio && (
                      <div className="mt-2 text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert">
                        <PortableText value={post.author.bio} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - YouTube Short (optional) + Table of Contents (desktop only) */}
          <aside className="hidden lg:block lg:col-span-1">
            {embedUrl ? (
              <div className="sticky top-24 h-[calc(100vh-8rem)] flex flex-col gap-3">
                <div className="bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-100 dark:border-gray-700 p-2 shrink-0">
                  <div className="relative w-45 aspect-9/16 mx-auto bg-black rounded overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title="Featured video"
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <TableOfContents embedded />
                </div>
              </div>
            ) : (
              <TableOfContents />
            )}
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-[#F9FAFB] border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogPostCard key={relatedPost._id} post={relatedPost} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
