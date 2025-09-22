import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"
// Import client components directly (dynamic imports causing issues)
import ScrollToTop from '@/components/ScrollToTop';
import Chatbot from '@/components/Chatbot';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import ClientLayout from '@/components/ClientLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

// Safely access font variables
const geistSansVariable = geistSans?.variable || "";
const geistMonoVariable = geistMono?.variable || "";

export const metadata: Metadata = {
  title: "Realty Canvas - Real Estate Listings",
  description: "Find your dream property with Realty Canvas",
  openGraph: {
    title: "Realty Canvas - Real Estate Listings",
    description: "Find your dream property with Realty Canvas",
    url: "https://www.realtycanvas.in",
    siteName: "Realty Canvas",
    images: [
      {
        url: "https://www.realtycanvas.in/logo.webp",
        width: 1200,
        height: 630,
        alt: "Realty Canvas - Real Estate Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realty Canvas - Real Estate Listings",
    description: "Find your dream property with Realty Canvas",
    images: ["https://www.realtycanvas.in/logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Viewport meta tag for proper mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Critical font preloading for faster LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Font preload removed due to invalid URL - Next.js font optimization handles this */}
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for immediate rendering */
            body {
              font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            
            /* Critical navigation styles */
            nav {
              position: fixed;
              top: 0;
              width: 100%;
              z-index: 50;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
            }
            
            /* Critical hero section styles */
            .hero-section {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            /* Prevent layout shift */
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* Critical loading state */
            .loading-skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `
        }} />
      </head>
      <body
        className={`${geistSansVariable} ${geistMonoVariable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <SpeedInsights/>
        <ThemeProvider>
          <AuthProvider>
            <ClientLayout>
              <Navbar />
              <div className="">
                {children}
              </div>
              <Footer />
              <ScrollToTop />
              {/* <Chatbot /> */}
              <LeadCaptureModal />
            </ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
