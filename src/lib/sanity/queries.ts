import { client, isDevelopmentMode } from './client'
import { BlogPost, BlogPostPreview, Category, Author } from './types'

// Mock data for development
const mockAuthor: Author = {
  _id: 'author-1',
  name: 'Sarah Johnson',
  slug: { current: 'sarah-johnson' },
  bio: [
    {
      _type: 'block',
      _key: 'bio-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'span-1',
          text: 'Senior Real Estate Analyst with over 10 years of experience in market research and property investment strategies.',
          marks: []
        }
      ],
      markDefs: []
    }
  ],
  email: 'sarah@realitycanvas.com',
  website: 'https://sarahjohnson.com',
  socialLinks: {
    twitter: '@sarahjohnson',
    linkedin: 'sarah-johnson-realestate',
    github: '@sarahjohnson'
  }
}

const mockCategories: Category[] = [
  {
    _id: 'category-1',
    title: 'Market Analysis',
    slug: { current: 'market-analysis' },
    description: 'In-depth analysis of real estate market trends and forecasts',
    color: 'blue'
  },
  {
    _id: 'category-2',
    title: 'Investment Tips',
    slug: { current: 'investment-tips' },
    description: 'Expert advice on real estate investment strategies',
    color: 'green'
  },
  {
    _id: 'category-3',
    title: 'Property Reviews',
    slug: { current: 'property-reviews' },
    description: 'Detailed reviews of properties and developments',
    color: 'purple'
  }
]

const mockBlogPosts: BlogPost[] = [
  {
    _id: 'post-1',
    title: 'The Future of Real Estate: Trends to Watch in 2024',
    slug: { current: 'future-real-estate-trends-2024' },
    excerpt: 'Discover the key trends shaping the real estate market in 2024, from smart homes to sustainable development.',
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    featured: true,
    body: [
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-1',
            text: 'The real estate industry is experiencing unprecedented changes as we move through 2024. From technological innovations to shifting consumer preferences, several key trends are reshaping how we buy, sell, and live in properties.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    mainImage: {
      asset: {
        _id: 'image-1',
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop'
      },
      alt: 'Modern real estate development'
    },
    categories: [mockCategories[0], mockCategories[1]],
    author: mockAuthor
  },
  {
    _id: 'post-2',
    title: 'Smart Investment Strategies for First-Time Property Buyers',
    slug: { current: 'smart-investment-strategies-first-time-buyers' },
    excerpt: 'Essential tips and strategies for first-time property buyers to make informed investment decisions.',
    publishedAt: '2024-01-10T14:30:00Z',
    readTime: 6,
    featured: false,
    body: [
      {
        _type: 'block',
        _key: 'block-2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-2',
            text: 'Entering the property market for the first time can be overwhelming. This comprehensive guide will help you navigate the complexities and make smart investment decisions.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    mainImage: {
      asset: {
        _id: 'image-2',
        url: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=400&fit=crop'
      },
      alt: 'Property investment planning'
    },
    categories: [mockCategories[1]],
    author: mockAuthor
  },
  {
    _id: 'post-3',
    title: 'Sustainable Architecture: Building for the Future',
    slug: { current: 'sustainable-architecture-building-future' },
    excerpt: 'Exploring how sustainable architecture is revolutionizing the construction industry and creating eco-friendly living spaces.',
    publishedAt: '2024-01-05T09:15:00Z',
    readTime: 10,
    featured: true,
    body: [
      {
        _type: 'block',
        _key: 'block-3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span-3',
            text: 'Sustainable architecture is no longer just a trend—it\'s becoming the standard for responsible development. Learn about the innovative approaches that are shaping the future of construction.',
            marks: []
          }
        ],
        markDefs: []
      }
    ],
    mainImage: {
      asset: {
        _id: 'image-3',
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=400&fit=crop'
      },
      alt: 'Sustainable building design'
    },
    categories: [mockCategories[0], mockCategories[2]],
    author: mockAuthor
  }
]

// GROQ queries for Sanity
const BLOG_POST_FIELDS = `
  _id,
  title,
  slug,
  author->{
    _id,
    name,
    slug,
    image{
      asset->{
        _id,
        url
      },
      alt
    },
    bio,
    email,
    website,
    socialLinks
  },
  mainImage{
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  categories[]->{
    _id,
    title,
    slug,
    description,
    color
  },
  publishedAt,
  excerpt,
  body,
  featured,
  readTime,
  seo
`

const BLOG_POST_PREVIEW_FIELDS = `
  _id,
  title,
  slug,
  author->{
    _id,
    name,
    slug,
    image{
      asset->{
        _id,
        url
      },
      alt
    }
  },
  mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  categories[]->{
    _id,
    title,
    slug,
    color
  },
  publishedAt,
  excerpt,
  featured,
  readTime
`

// Helper functions for mock data
function getMockImageUrl(imageRef: string): string {
  const imageMap: { [key: string]: string } = {
    'image-1': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
    'image-2': 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=400&fit=crop',
    'image-3': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=400&fit=crop'
  }
  return imageMap[imageRef] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'
}

// Query functions
export async function getAllBlogPosts(limit = 10, offset = 0): Promise<BlogPostPreview[]> {
  if (isDevelopmentMode) {
    return mockBlogPosts.slice(offset, offset + limit).map(post => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      author: {
        _id: post.author._id,
        name: post.author.name,
        slug: post.author.slug
      },
      mainImage: post.mainImage,
      categories: post.categories,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      featured: post.featured,
      readTime: post.readTime
    }))
  }

  const query = `*[_type == "blogPost"] | order(publishedAt desc) [${offset}...${offset + limit}] {
    ${BLOG_POST_PREVIEW_FIELDS}
  }`
  
  return client.fetch(query)
}

export async function getFeaturedBlogPosts(): Promise<BlogPostPreview[]> {
  if (isDevelopmentMode) {
    return mockBlogPosts.filter(post => post.featured).map(post => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      author: {
        _id: post.author._id,
        name: post.author.name,
        slug: post.author.slug
      },
      mainImage: post.mainImage,
      categories: post.categories,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      featured: post.featured,
      readTime: post.readTime
    }))
  }

  const query = `*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    ${BLOG_POST_PREVIEW_FIELDS}
  }`
  
  return client.fetch(query)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isDevelopmentMode) {
    return mockBlogPosts.find(post => post.slug.current === slug) || null
  }

  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_FIELDS}
  }`
  
  return client.fetch(query, { slug })
}

export async function getBlogPostsByCategory(categorySlug: string, limit = 10): Promise<BlogPostPreview[]> {
  if (isDevelopmentMode) {
    return mockBlogPosts
      .filter(post => post.categories?.some(cat => cat.slug.current === categorySlug))
      .slice(0, limit)
      .map(post => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        author: {
          _id: post.author._id,
          name: post.author.name,
          slug: post.author.slug
        },
        mainImage: post.mainImage,
        categories: post.categories || [],
        publishedAt: post.publishedAt,
        excerpt: post.excerpt,
        featured: post.featured,
        readTime: post.readTime
      }))
  }

  const query = `*[_type == "blogPost" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) [0...${limit}] {
    ${BLOG_POST_PREVIEW_FIELDS}
  }`
  
  return client.fetch(query, { categorySlug })
}

export async function getAllCategories(): Promise<Category[]> {
  if (isDevelopmentMode) {
    return mockCategories
  }

  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }`
  
  return client.fetch(query)
}

export async function getAllAuthors(): Promise<Author[]> {
  if (isDevelopmentMode) {
    return [mockAuthor]
  }

  const query = `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    email,
    website,
    socialLinks
  }`
  
  return client.fetch(query)
}

export async function getBlogPostsByAuthor(authorSlug: string, limit = 10): Promise<BlogPostPreview[]> {
  if (isDevelopmentMode) {
    return mockBlogPosts
      .filter(post => post.author.slug.current === authorSlug)
      .slice(0, limit)
      .map(post => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        author: {
          _id: post.author._id,
          name: post.author.name,
          slug: post.author.slug
        },
        mainImage: post.mainImage,
        categories: post.categories,
        publishedAt: post.publishedAt,
        excerpt: post.excerpt,
        featured: post.featured,
        readTime: post.readTime
      }))
  }

  const query = `*[_type == "blogPost" && author->slug.current == $authorSlug] | order(publishedAt desc) [0...${limit}] {
    ${BLOG_POST_PREVIEW_FIELDS}
  }`
  
  return client.fetch(query, { authorSlug })
}

export async function getRelatedBlogPosts(currentSlug: string, categories: string[], limit = 3): Promise<BlogPostPreview[]> {
  if (isDevelopmentMode) {
    return mockBlogPosts
      .filter(post => 
        post.slug.current !== currentSlug && 
        post.categories?.some(cat => categories.includes(cat._id))
      )
      .slice(0, limit)
      .map(post => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        author: {
          _id: post.author._id,
          name: post.author.name,
          slug: post.author.slug
        },
        mainImage: post.mainImage,
        categories: post.categories || [],
        publishedAt: post.publishedAt,
        excerpt: post.excerpt,
        featured: post.featured,
        readTime: post.readTime
      }))
  }

  const query = `*[_type == "blogPost" && slug.current != $currentSlug && count((categories[]._ref)[@ in $categories]) > 0] | order(publishedAt desc) [0...${limit}] {
    ${BLOG_POST_PREVIEW_FIELDS}
  }`
  
  return client.fetch(query, { currentSlug, categories })
}