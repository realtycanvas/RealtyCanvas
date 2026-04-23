'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    initials: 'RK',
    color: 'bg-yellow-400',
    text: 'Realty Canvas made my home-buying journey completely stress-free. They understood exactly what I needed and shortlisted only relevant options. Transparent about pricing, RERA compliance, and possession timelines. Could not have asked for a better team.',
    date: 'March 2026',
  },
  {
    name: 'Priya Sharma',
    initials: 'PS',
    color: 'bg-blue-500',
    text: 'Outstanding experience from start to finish. The advisor was patient, knowledgeable, and genuinely invested in helping us find the right property in Dwarka Expressway. Every question was answered honestly. Highly recommend Realty Canvas to anyone serious about buying in Gurgaon.',
    date: 'February 2026',
  },
  {
    name: 'Amit Gupta',
    initials: 'AG',
    color: 'bg-green-500',
    text: 'We were comparing multiple projects across Golf Course Extension Road and Realty Canvas gave us a thorough data-backed comparison. No pressure, no upselling — just solid advice. Booked our 4 BHK with full confidence.',
    date: 'January 2026',
  },
  {
    name: 'Neha Singh',
    initials: 'NS',
    color: 'bg-purple-500',
    text: 'As an NRI buying property remotely, I was worried about verification and legal clarity. Realty Canvas handled everything — from RERA checks to virtual walkthroughs — without a single issue. The process was smooth and they were always reachable.',
    date: 'March 2026',
  },
  {
    name: 'Vikram Malhotra',
    initials: 'VM',
    color: 'bg-rose-500',
    text: 'Invested in a commercial project on SPR based on Realty Canvas\'s recommendation. The research they shared on rental yield and corridor growth was genuinely impressive. Already seeing strong appreciation. Trustworthy advisors.',
    date: 'February 2026',
  },
  {
    name: 'Sunita Agarwal',
    initials: 'SA',
    color: 'bg-orange-400',
    text: 'After months of searching on my own and getting nowhere, a friend referred me to Realty Canvas. Within two weeks I had shortlisted three projects and made a booking. The clarity they brought to the process was remarkable.',
    date: 'January 2026',
  },
];

function GoogleLogo() {
  return (
    <span className="text-sm font-semibold tracking-tight shrink-0">
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>o</span>
      <span style={{ color: '#FBBC05' }}>o</span>
      <span style={{ color: '#4285F4' }}>g</span>
      <span style={{ color: '#34A853' }}>l</span>
      <span style={{ color: '#EA4335' }}>e</span>
    </span>
  );
}

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const short = t.text.length > 160;

  return (
    <div className="h-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`${t.color} w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {t.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">{t.name}</span>
              <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">Verified Buyer</p>
          </div>
        </div>
        <GoogleLogo />
      </div>

      <StarRating />

      {/* Review text */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">
        &ldquo;{expanded || !short ? t.text : `${t.text.slice(0, 160)}...`}&rdquo;
      </p>

      {short && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-400 hover:text-brand-primary text-left transition-colors"
        >
          {expanded ? 'read less' : 'read more'}
        </button>
      )}

      <p className="text-xs text-gray-800 mt-auto">{t.date}</p>
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? el.clientWidth : -el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Real Stories from{' '}
            <span className="text-brand-primary">Happy Homeowners</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            98% client satisfaction rate — as Gurgaon&apos;s trusted real estate advisors, we handle
            everything from RERA compliance to possession.{' '}
            <span className="text-brand-primary font-medium">100% verified projects only.</span>
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Hidden on mobile — touch users swipe; shown sm+ only when there's content to scroll */}
          <button
            onClick={() => scrollBy('left')}
            aria-label="Scroll left"
            className={`absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 items-center justify-center bg-white border border-gray-200 rounded-full p-2 shadow-md ${canScrollLeft ? 'hidden sm:flex' : 'hidden'}`}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] self-stretch"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollBy('right')}
            aria-label="Scroll right"
            className={`absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 items-center justify-center bg-white border border-gray-200 rounded-full p-2 shadow-md ${canScrollRight ? 'hidden sm:flex' : 'hidden'}`}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Swipe hint — only visible on mobile */}
        <p className="mt-4 text-center text-xs text-gray-400 sm:hidden">Swipe to see more reviews</p>
      </div>
    </section>
  );
}
