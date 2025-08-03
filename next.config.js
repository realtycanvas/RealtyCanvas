/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'xsgljyuvykzfzvqwgtev.supabase.co', // Wildcard pattern for all Supabase URLs
      'supabase.co',
      'images.pexels.com', // Added for Pexels images
      'upload.wikimedia.org', // Added for Wikimedia images
      'example.com'
    ],
  },
  // Ensure CSS modules are properly handled
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;