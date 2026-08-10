'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type UnlockImage = { src: string; alt: string };

type EnquiryRequest = {
  // Shown above the modal title, e.g. "Download Brochure" or "Vedic City Site Plan".
  label: string;
  // Revealed in the lightbox once the enquiry is submitted (gated content).
  unlockImage?: UnlockImage;
};

type VedicContextValue = {
  enquiry: EnquiryRequest | null;
  openEnquiry: (request: EnquiryRequest) => void;
  closeEnquiry: () => void;
  lightbox: { images: UnlockImage[]; index: number } | null;
  openLightbox: (images: UnlockImage[], index: number) => void;
  closeLightbox: () => void;
  stepLightbox: (delta: number) => void;
};

const VedicContext = createContext<VedicContextValue | null>(null);

export function useVedic() {
  const ctx = useContext(VedicContext);
  if (!ctx) throw new Error('useVedic must be used inside <VedicProvider>');
  return ctx;
}

export default function VedicProvider({ children }: { children: React.ReactNode }) {
  const [enquiry, setEnquiry] = useState<EnquiryRequest | null>(null);
  const [lightbox, setLightbox] = useState<{ images: UnlockImage[]; index: number } | null>(null);

  const openEnquiry = useCallback((request: EnquiryRequest) => setEnquiry(request), []);
  const closeEnquiry = useCallback(() => setEnquiry(null), []);

  const openLightbox = useCallback((images: UnlockImage[], index: number) => setLightbox({ images, index }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const stepLightbox = useCallback((delta: number) => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const total = prev.images.length;
      return { ...prev, index: (prev.index + delta + total) % total };
    });
  }, []);

  const value = useMemo(
    () => ({ enquiry, openEnquiry, closeEnquiry, lightbox, openLightbox, closeLightbox, stepLightbox }),
    [enquiry, openEnquiry, closeEnquiry, lightbox, openLightbox, closeLightbox, stepLightbox]
  );

  return <VedicContext.Provider value={value}>{children}</VedicContext.Provider>;
}
