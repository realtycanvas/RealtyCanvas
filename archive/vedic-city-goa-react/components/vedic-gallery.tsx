'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GALLERY } from './data';
import { useVedic } from './vedic-provider';

const PREVIEW_COUNT = 7;

export default function VedicGallery() {
  const { openLightbox } = useVedic();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? GALLERY : GALLERY.slice(0, PREVIEW_COUNT);

  return (
    <section id="gallery" className="scroll-mt-20 bg-gray-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-brand-secondary sm:text-3xl lg:text-4xl">Project Gallery</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Discover the beauty and elegance of Vedic City Anandam through our curated collection of images.
          </p>
        </div>

        {/* Mosaic: first image spans two columns and rows on larger screens. */}
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:grid-cols-4">
          {visible.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => openLightbox([...GALLERY], i)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              aria-label={`View image ${i + 1} of ${GALLERY.length}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-brand-secondary/0 transition-colors group-hover:bg-brand-secondary/25" />
            </button>
          ))}
        </div>

        {!showAll && GALLERY.length > PREVIEW_COUNT && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary/90"
            >
              View All Photos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
