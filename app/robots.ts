import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/studio/', '/api/', '/projects/create'],
      },
    ],
    sitemap: 'https://www.realtycanvas.in/sitemap.xml',
  };
}
