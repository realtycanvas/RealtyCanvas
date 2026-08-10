'use client';

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { HERO } from './data';
import VedicLeadForm from './vedic-lead-form';

// Mirrors the reference banner wash (115deg, strongest behind the headline and
// clearing to almost nothing on the right). Deliberately much lighter than a flat
// black scrim so the banner video still reads as moving footage rather than a photo.
const HERO_OVERLAY =
  'linear-gradient(115deg, rgba(13,27,37,0.58) 0%, rgba(13,27,37,0.38) 42%, rgba(0,0,0,0.14) 100%)';

// Shape only — every colour lives on the row variants below, so the two variants
// never fight over the same property in an order-dependent way.
const FEATURE_ROW =
  'flex w-full items-center gap-2.5 rounded-[10px] border border-l-[3px] border-l-brand-primary px-4 py-[11px] text-[13px] font-semibold leading-[1.35]';

const FEATURE_ROW_DARK = 'border-white/20 bg-black/35 text-white';

// The price row inverts to a solid card so it wins the eye against the dark rows
// above it — the same emphasis trick the reference banner uses.
const FEATURE_ROW_SOLID = 'border-brand-primary/30 bg-white/97 text-brand-secondary';

const FEATURE_ICON = 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full';

export default function VedicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Brave shields, iOS low-power mode and data-saver modes can reject autoplay even
  // on a muted video - the poster/first frame paints but never advances. Retry once
  // on the first user gesture, which browsers always accept as consent to play.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => video.play().catch(() => false);

    let detach = () => {};
    void play().then((started) => {
      if (started !== false) return;

      const retry = () => {
        void play();
        detach();
      };
      const events = ['pointerdown', 'touchstart', 'keydown', 'scroll'] as const;
      events.forEach((event) => window.addEventListener(event, retry, { once: true, passive: true }));
      detach = () => events.forEach((event) => window.removeEventListener(event, retry));
    });

    return () => detach();
  }, []);

  return (
    // Desktop height is clamped (as the original was) so the video frame stays in
    // proportion instead of being stretched tall by the enquiry card. Mobile stacks
    // and grows with its content.
    <section className="relative flex min-h-144 items-center overflow-hidden pt-24 pb-14 lg:h-[clamp(580px,52vw,680px)] lg:min-h-0 lg:pt-25 lg:pb-22">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/vedic-city-goa/gallery/gallery-01.webp"
        aria-label="Vedic City Goa banner video"
      >
        <source src="/vedic-city-goa/video/vedic_intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: HERO_OVERLAY }} aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:gap-7 lg:px-8">
        <div className="flex flex-col items-start pt-2">
          <div className="flex flex-col gap-3 pr-2">
            <span className="self-start rounded border border-brand-secondary border-l-4 border-l-brand-primary bg-brand-secondary px-4 py-2.5 text-[11px] font-bold tracking-[1.1px] text-white uppercase">
              {HERO.eyebrow}
            </span>
            <h1 className="pt-1 text-[clamp(32px,5vw,56px)] leading-[1.05] font-extrabold tracking-[0.06em] text-white uppercase">
              {HERO.title}
            </h1>
          </div>

          <div className="mt-[18px] flex w-[min(100%,300px)] flex-col gap-[15px]">
            <div className={`${FEATURE_ROW} ${FEATURE_ROW_DARK}`}>
              <span className={`${FEATURE_ICON} bg-brand-primary/20`} aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              </span>
              <span className="min-w-0 flex-1">{HERO.connectivity}</span>
            </div>

            <ul className="flex list-none flex-col gap-[15px]" aria-label="Project highlights">
              {HERO.highlights.map((item) => (
                <li key={item} className={`${FEATURE_ROW} ${FEATURE_ROW_DARK}`}>
                  <span className={`${FEATURE_ICON} bg-brand-primary`} aria-hidden="true">
                    <Check className="h-3 w-3 text-brand-secondary" strokeWidth={3.5} />
                  </span>
                  <span className="min-w-0 flex-1">{item}</span>
                </li>
              ))}

              <li className={`${FEATURE_ROW} ${FEATURE_ROW_SOLID}`}>
                <span className={`${FEATURE_ICON} bg-brand-secondary`} aria-hidden="true">
                  <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-extrabold">{HERO.price.amount}</span> {HERO.price.suffix}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <aside className="w-full">
          <div className="rounded-2xl bg-white px-6 py-7 shadow-[0_20px_50px_rgba(13,27,37,0.18)] md:rounded-xl md:bg-white/15 md:shadow-[0_16px_48px_rgba(0,0,0,0.22)] md:backdrop-blur-[2px]">
            <div className="mb-4 border-b border-black/10 pb-3.5 md:border-white/20">
              <h2 className="text-[26px] font-bold text-brand-secondary md:text-white">Enquire Now</h2>
              <p className="mt-1.5 text-[13px] leading-[1.4] text-gray-500 md:text-white/80">
                Get brochures, pricing &amp; site visit slots
              </p>
            </div>
            <VedicLeadForm formId="hero" variant="glass" />
          </div>
        </aside>
      </div>
    </section>
  );
}
