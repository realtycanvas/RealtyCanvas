'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { NAV_LINKS, VEDIC } from './data';

export default function VedicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className="h-1 w-full bg-brand-primary" aria-hidden="true" />

      <div
        className={`transition-colors duration-300 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-linear-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0" aria-label="Realty Canvas home">
            {/* Dark logo once the bar turns white, light logo over the video. */}
            <Image
              src={scrolled ? '/logo/logo-original.webp' : '/logo/logo-white.webp'}
              alt="Realty Canvas"
              width={150}
              height={40}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav aria-label="Section navigation" className="hidden items-center gap-5 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors hover:text-brand-primary ${
                  scrolled ? 'text-brand-secondary' : 'text-white/85'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${VEDIC.phoneHref}`}
              className="hidden items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-[13px] font-semibold text-brand-secondary transition-colors hover:bg-brand-primary/85 sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" />
              {VEDIC.phoneDisplay}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={`cursor-pointer rounded-md p-2 transition-colors lg:hidden ${
                scrolled ? 'text-brand-secondary hover:bg-black/5' : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <nav
            aria-label="Section navigation"
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-brand-secondary p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-white/50">Navigation</span>
                <span className="mt-1 block text-sm font-semibold text-brand-primary">{VEDIC.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="cursor-pointer rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex-1 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-brand-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={`tel:${VEDIC.phoneHref}`}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary px-4 py-3 text-sm font-semibold text-brand-secondary"
            >
              <Phone className="h-4 w-4" />
              {VEDIC.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
