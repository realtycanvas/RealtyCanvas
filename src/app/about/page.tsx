import { Metadata } from 'next';
import JsonLd from '@/components/SEO/JsonLd';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutMission from '@/components/about/AboutMission';
import AboutTeam from '@/components/about/AboutTeam';
import AboutStats from '@/components/about/AboutStats';

export const metadata: Metadata = {
  title: 'About Us - RealityCanvas',
  description: 'Learn about RealityCanvas, our mission to transform the real estate industry, and meet our dedicated team of professionals.',
  keywords: 'about realitycanvas, real estate company, property development, team, mission, vision',
  openGraph: {
    title: 'About Us - RealityCanvas',
    description: 'Learn about RealityCanvas, our mission to transform the real estate industry, and meet our dedicated team of professionals.',
    type: 'website',
    url: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in') + '/about',
    siteName: 'Realty Canvas',
  },
  alternates: { canonical: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in') + '/about' },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Realty Canvas',
    description: 'Learn about Realty Canvas, our mission, vision, and team.',
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  return (
    <main className="min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "url": `${baseUrl}/about`,
        "name": "About Realty Canvas",
        "isPartOf": {
          "@type": "WebSite",
          "url": baseUrl
        }
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl},
          {"@type": "ListItem", "position": 2, "name": "About", "item": `${baseUrl}/about`}
        ]
      }} />
      <AboutHero />
      <AboutStory />
      <AboutMission />
      {/* <AboutStats /> */}
      {/* <AboutTeam /> */}
    </main>
  );
}