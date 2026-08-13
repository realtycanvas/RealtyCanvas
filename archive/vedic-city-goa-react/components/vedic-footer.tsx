'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DISCLAIMER, VEDIC } from './data';

export default function VedicFooter() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer className="bg-brand-secondary pb-24 pt-14 text-white sm:pb-14">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Link href="/" className="inline-block" aria-label="Realty Canvas home">
          <Image src="/logo/logo-white.webp" alt="Realty Canvas" width={170} height={46} className="h-10 w-auto" />
        </Link>
        <p className="mt-3 text-xs text-white/60">{VEDIC.tagline}</p>

        <p className="mt-8 text-xs font-semibold text-brand-primary">{DISCLAIMER.rera}</p>

        <div className="mt-6 border-t border-white/10 pt-6 text-left">
          <p className="text-[11px] leading-relaxed text-white/50">
            <strong className="text-white/70">Disclaimer</strong> - {DISCLAIMER.short}
          </p>
          {expanded && <p className="mt-3 text-[11px] leading-relaxed text-white/50">{DISCLAIMER.more}</p>}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="mt-3 cursor-pointer text-[11px] font-semibold text-brand-primary hover:underline"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-[11px] text-white/50">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Copyright © {new Date().getFullYear()} Realty Canvas</span>
            <span aria-hidden="true">|</span>
            <a href={`tel:${VEDIC.phoneHref}`} className="hover:text-brand-primary">
              {VEDIC.phoneDisplay}
            </a>
            <span aria-hidden="true">|</span>
            <Link href="/privacy-policy" className="hover:text-brand-primary">
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/terms-of-service" className="hover:text-brand-primary">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
