'use client';

import { usePathname } from 'next/navigation';

// Standalone landing pages render their own header/footer, so the global
// navbar and footer are suppressed on these routes (and anything nested
// under them). Add a route here when a page ships its own chrome.
const STANDALONE_ROUTES = ['/vedic-city-goa'];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandalone = STANDALONE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isStandalone) return null;

  return <>{children}</>;
}
