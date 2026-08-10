import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import VedicProvider from '@/components/vedic-city-goa/vedic-provider';
import VedicHeader from '@/components/vedic-city-goa/vedic-header';
import VedicHero from '@/components/vedic-city-goa/vedic-hero';
import VedicOverview from '@/components/vedic-city-goa/vedic-overview';
import VedicHighlights from '@/components/vedic-city-goa/vedic-highlights';
import VedicAmenities from '@/components/vedic-city-goa/vedic-amenities';
import VedicSitePlans from '@/components/vedic-city-goa/vedic-site-plans';
import VedicPriceList from '@/components/vedic-city-goa/vedic-price-list';
import VedicGallery from '@/components/vedic-city-goa/vedic-gallery';
import VedicLocation from '@/components/vedic-city-goa/vedic-location';
import VedicContact from '@/components/vedic-city-goa/vedic-contact';
import VedicFooter from '@/components/vedic-city-goa/vedic-footer';
import VedicStickyActions from '@/components/vedic-city-goa/vedic-sticky-actions';
import { VedicEnquiryModal, VedicWelcomeModal, VedicLightbox } from '@/components/vedic-city-goa/vedic-modals';

const PAGE_URL = `${siteConfig.siteUrl}/vedic-city-goa`;
const TITLE = 'Vedic City Goa - Premium Villa Plots in North Goa, 20 Mins from MOPA Airport';
const DESCRIPTION =
  'Vedic City Anandam North Goa: 46-acre villa plot development within a 300+ acre township. Plots from 240 sq. yd., ₹58 Lakh onwards, 20 minutes from MOPA Airport via NH-66. Enquire with Realty Canvas for pricing, site plans and site visits.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: siteConfig.siteName,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${siteConfig.siteUrl}/vedic-city-goa/gallery/gallery-01.webp`,
        width: 1600,
        height: 900,
        alt: 'Vedic City Goa villa plots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${siteConfig.siteUrl}/vedic-city-goa/gallery/gallery-01.webp`],
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateListing',
      '@id': `${PAGE_URL}#listing`,
      name: 'Vedic City Goa - Anandam Villa Plots',
      url: PAGE_URL,
      description: DESCRIPTION,
      image: `${siteConfig.siteUrl}/vedic-city-goa/gallery/gallery-01.webp`,
      offers: {
        '@type': 'Offer',
        price: 5800000,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'North Goa',
        addressRegion: 'Goa',
        addressCountry: 'IN',
      },
      broker: {
        '@type': 'RealEstateAgent',
        name: siteConfig.siteName,
        url: siteConfig.siteUrl,
        telephone: '+91-9555562626',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Vedic City Goa', item: PAGE_URL },
      ],
    },
  ],
};

export default function VedicCityGoaPage() {
  return (
    <VedicProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <VedicHeader />
      <main>
        <VedicHero />
        <VedicOverview />
        <VedicHighlights />
        <VedicAmenities />
        <VedicSitePlans />
        <VedicPriceList />
        <VedicGallery />
        <VedicLocation />
        <VedicContact />
      </main>
      <VedicFooter />

      <VedicStickyActions />
      <VedicEnquiryModal />
      <VedicWelcomeModal />
      <VedicLightbox />
    </VedicProvider>
  );
}
