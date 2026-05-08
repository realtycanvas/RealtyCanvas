import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      { source: '/logo-white.webp', destination: '/logo/logo-white.webp' },
      { source: '/logo-original.webp', destination: '/logo/logo-original.webp' },
    ];
  },
  async redirects() {
    return [
      {
        source: '/gurugram-residential-plots',
        destination: '/residential-plots-in-gurgaon',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Supabase
      {
        protocol: 'https',
        hostname: 'xsgljyuvykzfzvqwgtev.supabase.co',
        pathname: '/**',
      },
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
      // Example
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
      {
        protocol: 'https',
        hostname: 'm3mgurugram.co.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.m3mgurugram.co.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm3mjewel.commercial-gurgaon.in',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'www.m3mprojects.in',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.m3mrealty.com',
        pathname: '/commercial/**',
      },
      {
        protocol: 'https',
        hostname: 'm3m-paragon57',
        pathname: '/commercial/**',
      },
      // ✅ Add CloudFront
      {
        protocol: 'https',
        hostname: 'd2dy9w7mmecm6m.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.realtycanvas.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'realtycanvas.in',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.realtycanvas.in',
        pathname: '/uploads/**',
      },
    ],
    // Optimize image loading to reduce transformation requests
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Reduce quality for non-critical images to save transformations
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add loader configuration for better Vercel compatibility
    loader: process.env.NODE_ENV === 'production' ? 'default' : 'default',
    // Disable optimization for external images in production if needed
    unoptimized: false,
  },
};

export default nextConfig;
