/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.3'],
  images: {
    remotePatterns: [
      // Unsplash (all paths)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Supabase storage buckets (your project)
      {
        protocol: 'https',
        hostname: 'xsgljyuvykzfzvqwgtev.supabase.co',
        pathname: '/**',
      },
      // Generic supabase domain
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      // Pexels
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      // Wikimedia
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      // M3M Jewel
      {
        protocol: 'https',
        hostname: 'm3mjewel.commercial-gurgaon.in',
        pathname: '/**',
      },
      // Example placeholder
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      // M3M Properties
      {
        protocol: 'https',
        hostname: 'www.m3mproperties.com',
        pathname: '/floorplan/**',
      },
      // M3M Jewel New
      {
        protocol: 'https',
        hostname: 'm3mjewel.commercial-gurgaon.in',
        pathname: '/img/**',
      },
    ],
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;