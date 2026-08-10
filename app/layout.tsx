import SEO from './seo';
import '@/stylesheets/globals.css';
import type { Metadata } from 'next';
import { InterClassName } from '@/lib/font';
import NextTopLoader from 'nextjs-toploader';
import { LAYOUT_METADATA } from '@/lib/metadata';

import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import SiteChrome from '@/components/layout/site-chrome';
import ClientLayout from '@/components/common/ClientLayout';

export const metadata: Metadata = LAYOUT_METADATA;
export const viewport = { width: 'device-width', initialScale: 1 };

const BASE_URL = 'https://www.realtycanvas.in';

const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['RealEstateAgent', 'Organization'],
      '@id': `${BASE_URL}/#organization`,
      name: 'Realty Canvas',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo/logo-white.webp`,
        width: 200,
        height: 60,
      },
      image: `${BASE_URL}/logo/logo-white.webp`,
      description:
        'Realty Canvas is a Gurugram-based real estate advisory specialising in verified residential and commercial projects across Gurgaon and NCR.',
      telephone: '+919555562626',
      email: 'sales@realtycanvas.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1st Floor, Landmark Cyber Park, Sector 67',
        addressLocality: 'Gurugram',
        postalCode: '122102',
        addressRegion: 'Haryana',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'City', name: 'Gurugram' },
        { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
      ],
      sameAs: [
        'https://www.facebook.com/realtycanvasofficial',
        'https://www.instagram.com/realtycanvas.official/?igsh=NnQ3Nmx2YzBhbDU4',
        'https://www.linkedin.com/company/realtycanvas/',
        'https://www.youtube.com/@Realty_Canvas',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Realty Canvas',
      description:
        'Find premium residential and commercial real estate projects in Gurugram with verified listings and expert guidance.',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/projects?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${InterClassName} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />
        <SEO />
        <NextTopLoader color="#FBB70F" showSpinner={false} />
        <ClientLayout>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          {children}
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </ClientLayout>
      </body>
    </html>
  );
}
