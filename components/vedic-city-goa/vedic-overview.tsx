'use client';

import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { OVERVIEW } from './data';
import { useVedic } from './vedic-provider';

export default function VedicOverview() {
  const { openEnquiry } = useVedic();

  return (
    <section id="overview" className="scroll-mt-20 bg-white py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-brand-primary/35 bg-brand-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-secondary">
            {OVERVIEW.kicker}
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.12] text-brand-secondary">
            {OVERVIEW.heading}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-[1.65] text-gray-600 sm:text-[15px]">
            <strong className="font-bold text-brand-secondary">{OVERVIEW.leadStrong}</strong>
            {OVERVIEW.lead}
          </p>

          {/* Card rows with a left accent bar, matching the hero feature rows. */}
          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
            {OVERVIEW.features.map((feature) => (
              <li
                key={feature.title}
                className="flex items-center gap-3 rounded-[10px] border border-gray-200 border-l-[3px] border-l-brand-primary bg-white px-4 py-3 shadow-[0_2px_10px_rgba(13,27,37,0.06)]"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary"
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3 text-brand-secondary" strokeWidth={3.5} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[13px] font-bold leading-tight text-brand-secondary">
                    {feature.title}
                  </strong>
                  <span className="mt-0.5 block text-[11px] leading-[1.4] text-gray-500">{feature.desc}</span>
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => openEnquiry({ label: 'Download Brochure' })}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-secondary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(13,27,37,0.18)] transition-colors hover:bg-brand-secondary/90"
          >
            Download Brochure
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_18px_45px_rgba(13,27,37,0.16)] lg:aspect-square">
          <Image
            src="/vedic-city-goa/overview.webp"
            alt="Vedic City Anandam villa plots in North Goa"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </figure>
      </div>
    </section>
  );
}
