'use client';

import Image from 'next/image';
import { Lock } from 'lucide-react';
import SectionHeading from './section-heading';
import { useVedic } from './vedic-provider';

const SITE_PLAN = {
  src: '/vedic-city-goa/layout.webp',
  alt: 'Vedic City sales layout plan with plot sizes',
};

export default function VedicSitePlans() {
  const { openEnquiry } = useVedic();

  // The plan itself is gated: submitting the enquiry reveals it in the lightbox.
  const unlock = () => openEnquiry({ label: 'Vedic City Site Plan', unlockImage: SITE_PLAN });

  return (
    <section id="book-site-visit" className="scroll-mt-20 bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Site Plans"
          lead="Meticulously planned across 46 acres, with low-density villa plots, wide avenues, and 40% of the land left open."
        />

        <div className="mx-auto max-w-3xl">
          <article className="overflow-hidden rounded-xl bg-white shadow-lg">
            <button
              type="button"
              onClick={unlock}
              className="group relative block w-full cursor-pointer"
              aria-label="Unlock the Vedic City site plan"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={SITE_PLAN.src}
                  alt={SITE_PLAN.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover blur-[3px] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-secondary/55">
                  <Lock className="h-7 w-7 text-brand-primary" aria-hidden="true" />
                  <span className="rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-secondary">
                    View Full Plan
                  </span>
                </div>
              </div>
            </button>

            <div className="flex flex-col items-center gap-3 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm text-gray-600">
                Share your details to view the full sales layout with plot sizes and numbering.
              </p>
              <button
                type="button"
                onClick={unlock}
                className="shrink-0 cursor-pointer rounded-md bg-brand-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary/90"
              >
                View Details
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
