/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.3'],
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
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
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;