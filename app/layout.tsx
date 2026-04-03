import SEO from './seo';
import '@/stylesheets/globals.css';
import type { Metadata } from 'next';
import { InterClassName } from '@/lib/font';
import NextTopLoader from 'nextjs-toploader';
import { LAYOUT_METADATA } from '@/lib/metadata';

import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ClientLayout from '@/components/common/ClientLayout';

export const metadata: Metadata = LAYOUT_METADATA;
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${InterClassName} antialiased`}>
        <SEO />
        <NextTopLoader color="#FBB70F" />
        <ClientLayout>
          <Navbar />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
