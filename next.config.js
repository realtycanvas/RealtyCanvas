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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(css)$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;