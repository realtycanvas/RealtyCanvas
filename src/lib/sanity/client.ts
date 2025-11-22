import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Check if we're in development mode without proper Sanity config
export const isDevelopmentMode = !projectId || projectId === 'your-sanity-project-id' || !process.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN === 'your-sanity-api-token'

export const client = createClient({
  projectId: isDevelopmentMode ? 'mock-project' : projectId,
  dataset: isDevelopmentMode ? 'mock-dataset' : dataset,
  apiVersion,
  useCdn: false, // Disable CDN to get fresh data
  token: process.env.SANITY_API_TOKEN,
})

// Set up the image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  if (isDevelopmentMode) {
    // Return a placeholder image URL for development
    return {
      width: (w: number) => ({
        height: (h: number) => ({
          url: () => `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=${w}&h=${h}&fit=crop`
        }),
        url: () => `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=${w}&fit=crop`
      }),
      url: () => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'
    }
  }
  return builder.image(source)
}

// For ISR, we'll revalidate every hour
export const revalidate = 3600