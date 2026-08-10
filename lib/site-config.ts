// Canonical site identity, reused by sitemap.ts, robots.ts and the llms.txt routes.
// Mirrors the values in lib/metadata.ts (LAYOUT_METADATA). Allows a NEXT_PUBLIC_SITE_URL
// override for non-production environments, falling back to the production domain.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.realtycanvas.in').replace(/\/+$/, '');

export const siteConfig = {
  siteUrl,
  siteName: 'Realty Canvas',
  description:
    'Realty Canvas helps you discover verified luxury residential and commercial real estate projects in Gurgaon - with RERA-verified listings, expert guidance, transparent pricing, and data-backed investment insights.',
} as const;
