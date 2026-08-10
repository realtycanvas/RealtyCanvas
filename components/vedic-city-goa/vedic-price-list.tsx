'use client';

import Image from 'next/image';
import { Lock } from 'lucide-react';
import SectionHeading from './section-heading';
import { useVedic } from './vedic-provider';

export default function VedicPriceList() {
  const { openEnquiry } = useVedic();

  return (
    <section id="price-list" className="scroll-mt-20 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Price List" lead="Transparent pricing with a stage-linked payment plan." />

        <div className="mx-auto max-w-md">
          <article className="relative overflow-hidden rounded-xl shadow-xl">
            <Image
              src="/vedic-city-goa/overview.webp"
              alt=""
              fill
              sizes="448px"
              aria-hidden="true"
              className="scale-110 object-cover blur-md saturate-[0.9]"
            />
            <div className="absolute inset-0 bg-brand-secondary/80" aria-hidden="true" />

            <div className="relative flex flex-col items-center px-6 py-12 text-center text-white">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">Starting</span>
              <p className="mt-3 flex items-start gap-1">
                <span className="mt-2 text-2xl font-medium">₹</span>
                <span className="text-6xl font-bold leading-none">58</span>
                <span className="mt-2 text-xl font-medium">Lacs*</span>
              </p>
              <span className="my-5 h-px w-16 bg-brand-primary" aria-hidden="true" />
              <p className="text-lg font-semibold">240 Sq. Yds.</p>
              <span className="mt-1 text-xs uppercase tracking-[0.15em] text-white/60">Onwards</span>

              <button
                type="button"
                onClick={() => openEnquiry({ label: 'View Price - 240 Sq. Yds. from ₹58 Lacs' })}
                className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-secondary transition-colors hover:bg-brand-primary/85"
              >
                <Lock className="h-4 w-4" />
                View Price
              </button>
            </div>
          </article>

          <p className="mt-4 text-center text-xs text-gray-500">
            *Indicative pricing, exclusive of statutory charges. GST as applicable.
          </p>
        </div>
      </div>
    </section>
  );
}
