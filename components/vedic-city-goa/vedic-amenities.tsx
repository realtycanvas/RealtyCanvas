'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading from './section-heading';
import { AMENITIES } from './data';

export default function VedicAmenities() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToSlide = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, AMENITIES.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      setIndex(clamped);
    }
  };

  // Keep the counter in step when the visitor swipes the track directly.
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const closest = slides.reduce(
      (best, slide, i) => {
        const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
        return distance < best.distance ? { distance, i } : best;
      },
      { distance: Infinity, i: 0 }
    );
    setIndex(closest.i);
  };

  return (
    <section id="amenities" className="scroll-mt-20 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Amenities"
          lead="Every space planned to bring nature, comfort, and community closer together"
        />
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AMENITIES.map((amenity) => (
          <article
            key={amenity.src}
            className="relative aspect-[4/3] w-[78vw] shrink-0 snap-start overflow-hidden rounded-xl sm:w-[44vw] lg:w-[30vw]"
          >
            <Image
              src={amenity.src}
              alt={amenity.label}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 30vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-4 pt-10">
              <p className="text-sm font-semibold text-white sm:text-base">{amenity.label}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => scrollToSlide(index - 1)}
          disabled={index === 0}
          aria-label="Previous amenity"
          className="cursor-pointer rounded-full border border-gray-300 p-2 text-brand-secondary transition-colors hover:border-brand-primary hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm tabular-nums text-gray-500" aria-live="polite">
          {index + 1} / {AMENITIES.length}
        </span>
        <button
          type="button"
          onClick={() => scrollToSlide(index + 1)}
          disabled={index === AMENITIES.length - 1}
          aria-label="Next amenity"
          className="cursor-pointer rounded-full border border-gray-300 p-2 text-brand-secondary transition-colors hover:border-brand-primary hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
