import Image from 'next/image';
import { LOCATION_POINTS, VEDIC } from './data';

export default function VedicLocation() {
  return (
    <section id="location" className="scroll-mt-20 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-brand-secondary sm:text-3xl lg:text-4xl">Location</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Strategically located for connectivity while surrounded by North Goa&apos;s natural calm.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {LOCATION_POINTS.map((point, i) => (
              <article key={point.title} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-brand-secondary"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-brand-secondary">{point.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{point.text}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="overflow-hidden rounded-xl border border-gray-200">
            <div className="relative aspect-[4/3]">
              <Image
                src="/vedic-city-goa/location.webp"
                alt="Vedic City Goa location map"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-brand-secondary">{VEDIC.name} (Site Office)</h3>
              <p className="mt-1 text-xs text-gray-500">Anandam, North Goa · 20 mins from MOPA Airport</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
