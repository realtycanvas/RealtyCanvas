/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.3"],
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
images: {
  remotePatterns: [
    // Unsplash
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
    // Supabase
    {
      protocol: "https",
      hostname: "xsgljyuvykzfzvqwgtev.supabase.co",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/**",
    },
    // Pexels
    {
      protocol: "https",
      hostname: "images.pexels.com",
      pathname: "/**",
    },
    // Wikimedia
    {
      protocol: "https",
      hostname: "upload.wikimedia.org",
      pathname: "/**",
    },
    // M3M Jewel
    {
      protocol: "https",
      hostname: "m3mjewel.commercial-gurgaon.in",
      pathname: "/**",
    },
    // Example
    {
      protocol: "https",
      hostname: "example.com",
      pathname: "/**",
    },
    // M3M Properties
    {
      protocol: "https",
      hostname: "www.m3mproperties.com",
      pathname: "/floorplan/**",
    },
    {
      protocol: "https",
      hostname: "m3mjewel.commercial-gurgaon.in",
      pathname: "/img/**",
    },
    {
      protocol: "https",
      hostname: "www.m3mprojects.in",
      pathname: "/images/**",
    },
    {
      protocol: "https",
      hostname: "www.m3mrealty.com",
      pathname: "/commercial/**",
    },
    {
      protocol: "https",
      hostname: "m3m-paragon57",
      pathname: "/commercial/**",
    },
    // ✅ Add CloudFront
    {
      protocol: "https",
      hostname: "d2dy9w7mmecm6m.cloudfront.net",
      pathname: "/**",
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
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
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
