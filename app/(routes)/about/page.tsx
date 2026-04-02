import type { Metadata } from 'next';
import JsonLd from '@/components/common/JsonLd';
import Breadcrumb from '@/components/ui/breadcrumb';
import AboutHero from '@/components/common/about/about-hero';
import AboutStory from '@/components/common/about/about-story';
import AboutMission from '@/components/common/about/about-mission';
import AboutContact from '@/components/common/about/about-contact';

export const metadata: Metadata = {
  title: 'About Realty Canvas | Trusted Real Estate Channel Partner in Gurgaon',
  description:
    'Learn how Realty Canvas combines market knowledge, verified listings, and clear processes to help buyers and investors find the best properties and growth potential in Gurgaon and Gurgaon',
  keywords: [
    'Realty Canvas Gurgaon',
    'real estate channel partner',
    'verified listings',
    'transparency',
    'innovation',
    'community building',
  ],
  openGraph: {
    title: 'About Realty Canvas | Trusted Real Estate Channel Partner in Gurgaon',
    description:
      'Learn how Realty Canvas combines market knowledge, verified listings, and clear processes to help buyers and investors find the best properties and growth potential in Gurgaon and Gurgaon',
    type: 'website',
    url: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in') + '/about',
    siteName: 'Realty Canvas',
  },
  alternates: { canonical: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in') + '/about' },
  twitter: {
    card: 'summary_large_image',
    title: 'About Realty Canvas | Trusted Real Estate Channel Partner in Gurgaon',
    description: 'Learn about Realty Canvas, our mission, vision, and values in Gurgaon and Gurgaon',
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          url: `${baseUrl}/about`,
          name: 'About Realty Canvas',
          isPartOf: {
            '@type': 'WebSite',
            url: baseUrl,
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${baseUrl}/about` },
          ],
        }}
      />
      <Breadcrumb items={[{ label: 'About' }]} />
      <AboutHero />
      <AboutStory />
      <AboutMission />
      <AboutContact />
    </main>
  );
}
