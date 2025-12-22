import { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  asset: {
    _id: string
    url: string
  }
  alt?: string
}

export interface Author {
  _id: string
  name: string
  slug: {
    current: string
  }
  bio?: PortableTextBlock[]
  email?: string
  website?: string
  image?: SanityImage
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'gray'
  postCount?: number
}

export interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  publishedAt: string
  readTime: number
  featured?: boolean
  body?: PortableTextBlock[]
  mainImage?: SanityImage
  author: Author
  categories?: Category[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  faqs?: {
    question: string
    answer: string
  }[]
}

export interface BlogPostPreview {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  publishedAt: string
  readTime: number
  featured?: boolean
  mainImage?: SanityImage
  author: Pick<Author, '_id' | 'name' | 'slug' | 'image'>
  categories?: Pick<Category, '_id' | 'title' | 'slug' | 'color'>[]
}

// Custom block content types for rich text
export interface CodeBlock {
  _type: 'codeBlock'
  language?: string
  code: string
}

export interface ImageBlock {
  _type: 'image'
  asset: {
    _id: string
    url: string
  }
  alt?: string
}