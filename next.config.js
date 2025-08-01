/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'xsgljyuvykzfzvqwgtev.supabase.co', // Wildcard pattern for all Supabase URLs
      'supabase.co',
      'images.pexels.com', // Added for Pexels images
    ],
  },
};

module.exports = nextConfig;