import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Chatbot from "@/components/Chatbot";

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
  title: "RealityCanvas - Real Estate Listings",
  description: "Find your dream property with RealityCanvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSansVariable} ${geistMonoVariable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <div className="">
              {children}
            </div>
            <Footer />
            <ScrollToTop />
            <Chatbot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
