'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './section-heading';
import { AMENITIES } from './data';

// Geometry ported 1:1 from the reference slider. Slides have a FIXED height at
// every breakpoint (they are not aspect-ratio boxes), the active slide widens to
// --center while the rest stay at --side, and below md the two are equal so it
// degrades to a one-up carousel with a 16vw peek.
const SLIDER_VARS = [
  '[--gap:10px] [--slide-h:220px] [--side:calc(84vw_-_10px)] [--center:calc(84vw_-_10px)] [--pull:0px]',
  'md:[--gap:12px] md:[--slide-h:clamp(220px,34vw,340px)] md:[--side:18vw] md:[--center:64vw]',
  // Measured against the live reference: the active slide settles at a small left
  // inset of 0.02*viewport - gap/2 (31px at 1905, 21px at 1425, 18px at 1265).
  'md:[--pull:calc(0.02*var(--vw)_-_var(--gap)/2)]',
  'lg:[--gap:14px] lg:[--slide-h:clamp(220px,28vw,340px)] lg:[--side:20vw] lg:[--center:58vw]',
].join(' ');

const EASE = 'cubic-bezier(0.25,0.46,0.45,0.94)';
const AUTOPLAY_MS = 4000;
const LAST = AMENITIES.length - 1;

export default function VedicAmenities() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);

  const go = useCallback((next: number) => setIndex(Math.max(0, Math.min(next, LAST))), []);

  // --vw is the slider container's own width, matching the reference's
  // $viewport.innerWidth(). It differs from 100vw by the scrollbar, which is what
  // decides where the track stops clamping at the end.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => root.style.setProperty('--vw', `${root.clientWidth}px`));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Autoplay wraps back to the first slide; the arrows deliberately do not.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) setIndex((current) => (current >= LAST ? 0 : current + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [index]);

  const step = (delta: number) => {
    go(index + delta);
    paused.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const delta = start - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) go(index + (delta > 0 ? 1 : -1));
  };

  // offset = clamp(0, i * step - pull, maxScroll) — the reference centres the active
  // slide but never scrolls past either end of the track.
  const trackStep = 'calc(var(--side) + var(--gap))';
  const maxScroll = `calc(${LAST} * ${trackStep} + var(--center) - var(--vw))`;
  const offset = `clamp(0px, calc(${index} * ${trackStep} - var(--pull)), max(0px, ${maxScroll}))`;

  return (
    <section id="amenities" className="scroll-mt-20 overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Amenities"
          lead="Every space planned to bring nature, comfort, and community closer together"
        />
      </div>

      <div
        ref={rootRef}
        className={SLIDER_VARS}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={(e) => (touchStartX.current = e.changedTouches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex gap-(--gap)"
          style={{ transform: `translateX(calc(-1 * ${offset}))`, transition: `transform 0.55s ${EASE}` }}
        >
          {AMENITIES.map((amenity, i) => {
            const isActive = i === index;
            return (
              <article
                key={amenity.src}
                onClick={() => go(i)}
                className="relative shrink-0 grow-0 cursor-pointer overflow-hidden"
                style={{
                  flexBasis: isActive ? 'var(--center)' : 'var(--side)',
                  height: 'var(--slide-h)',
                  transition: `flex-basis 0.55s ${EASE}`,
                }}
              >
                <Image
                  src={amenity.src}
                  alt={amenity.label}
                  fill
                  sizes="(max-width: 768px) 84vw, (max-width: 1024px) 64vw, 58vw"
                  className="object-cover transition-opacity duration-450"
                  style={{ opacity: isActive ? 1 : 0.82 }}
                />

                {/* Label rides only on the active slide, as in the reference. */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/55 to-transparent px-5 pt-7 pb-4 transition-opacity duration-400"
                  style={{ opacity: isActive ? 1 : 0 }}
                  aria-hidden={!isActive}
                >
                  <p className="flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                    <Check className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                    {amenity.label}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3.5">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index === 0}
          aria-label="Previous amenity"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-brand-secondary transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span
          className="rounded-full border border-brand-secondary/15 px-6 py-2.5 text-sm font-semibold text-brand-secondary tabular-nums"
          aria-live="polite"
        >
          {index + 1} <span className="text-brand-secondary/40">/</span> {AMENITIES.length}
        </span>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={index === LAST}
          aria-label="Next amenity"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-brand-secondary text-white transition-colors hover:bg-brand-secondary/85 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
