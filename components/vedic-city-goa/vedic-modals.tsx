'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVedic } from './vedic-provider';
import VedicLeadForm from './vedic-lead-form';
import { VEDIC } from './data';

// Locks body scroll while any overlay is open.
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="max-h-full w-full overflow-y-auto sm:w-auto">
        {children}
      </div>
    </div>
  );
}

export function VedicEnquiryModal() {
  const { enquiry, closeEnquiry, openLightbox } = useVedic();
  useScrollLock(Boolean(enquiry));

  if (!enquiry) return null;

  const handleSuccess = () => {
    const unlock = enquiry.unlockImage;
    closeEnquiry();
    // Gated assets (site plan, brochure preview) open once the lead is captured.
    if (unlock) openLightbox([unlock], 0);
  };

  return (
    <Overlay onClose={closeEnquiry}>
      <div className="relative mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:w-[26rem]">
        <button
          type="button"
          onClick={closeEnquiry}
          aria-label="Close"
          className="absolute right-3 top-3 cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
          {enquiry.label}
        </span>
        <h3 className="mt-1 text-xl font-bold text-brand-secondary">{VEDIC.name}</h3>
        <p className="mt-2 mb-4 text-sm text-gray-500">
          Share your details and our team will help you with pricing, brochures, or a site visit.
        </p>

        <VedicLeadForm formId="enquiry-modal" submitLabel="Submit" onSuccess={handleSuccess} />
      </div>
    </Overlay>
  );
}

export function VedicWelcomeModal() {
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  useEffect(() => {
    // Once per browser session, after the visitor has had a moment with the page.
    if (sessionStorage.getItem('vedic-welcome-seen')) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('vedic-welcome-seen', '1');
      setOpen(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <Overlay onClose={() => setOpen(false)}>
      <div className="relative mx-auto grid w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl md:grid-cols-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-white/90 p-1.5 text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative hidden min-h-[22rem] md:block">
          <Image
            src="/vedic-city-goa/overview.webp"
            alt="Vedic City Goa villa plot community"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
            <p className="text-xs text-white/90">{VEDIC.tagline}</p>
          </div>
        </div>

        <div className="p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">Welcome to</span>
          <h3 className="mt-1 text-2xl font-bold text-brand-secondary">{VEDIC.name}</h3>
          <p className="mt-2 mb-4 text-sm text-gray-500">Get project details or schedule your site visit today.</p>
          <VedicLeadForm formId="welcome-modal" submitLabel="Enquire Now" onSuccess={() => setOpen(false)} />
        </div>
      </div>
    </Overlay>
  );
}

export function VedicLightbox() {
  const { lightbox, closeLightbox, stepLightbox } = useVedic();
  useScrollLock(Boolean(lightbox));

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, stepLightbox]);

  if (!lightbox) return null;

  const current = lightbox.images[lightbox.index];
  const hasMultiple = lightbox.images.length > 1;

  return (
    <Overlay onClose={closeLightbox}>
      <div className="relative flex max-h-[88vh] w-[92vw] max-w-5xl flex-col items-center gap-3">
        <button
          type="button"
          onClick={closeLightbox}
          aria-label="Close"
          className="absolute -top-1 right-0 z-10 cursor-pointer rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative mt-10 h-[70vh] w-full">
          <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" priority />
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-6 text-white">
            <button
              type="button"
              onClick={() => stepLightbox(-1)}
              aria-label="Previous image"
              className="cursor-pointer rounded-full bg-white/15 p-2 transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm tabular-nums">
              {lightbox.index + 1} / {lightbox.images.length}
            </span>
            <button
              type="button"
              onClick={() => stepLightbox(1)}
              aria-label="Next image"
              className="cursor-pointer rounded-full bg-white/15 p-2 transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}
