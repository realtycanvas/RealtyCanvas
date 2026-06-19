'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

type Plot = {
  name: string;
  image: string;
  description: string;
};

const plots: Plot[] = [
  {
    name: 'DLF Phase 1',
    image: '/sector-maps/dlf-phase-1.jpg',
    description:
      'Own a premium residential plot in the heart of Gurgaon at DLF Phase 1, one of the city\'s most established luxury neighborhoods. Enjoy seamless connectivity to Golf Course Road, Cyber City, and top social hubs. Surrounded by premium schools, malls, and hospitals, it offers an unmatched lifestyle and high appreciation potential. A perfect choice for building your dream home or securing a future-ready investment.',
  },
  {
    name: 'DLF Phase 2',
    image: '/sector-maps/dlf-phase-2.jpg',
    description:
      'DLF Phase 2 offers exclusive residential plots in a prime Gurgaon location with direct access to MG Road and Cyber Hub. Known for its upscale environment and strong infrastructure, this locality attracts both end-users and investors. Wide roads, green surroundings, and premium amenities make it highly desirable. Invest in a location where luxury living meets excellent returns.',
  },
  {
    name: 'DLF Phase 4',
    image: '/sector-maps/dlf-phase-4.jpg',
    description:
      'Build your dream home in DLF Phase 4, one of Gurgaon\'s most sought-after residential destinations. Strategically located near Galleria Market and Golf Course Road, it offers unmatched convenience and connectivity. The area is known for its elite neighborhood, lush green surroundings, and premium lifestyle. A smart investment choice with strong rental and resale demand.',
  },
  {
    name: 'DLF Phase 5',
    image: '/sector-maps/dlf-phase-5.jpg',
    description:
      'Experience luxury living with residential plots in DLF Phase 5, Gurgaon\'s premium address for high-end residences. Close to Golf Course Road, Rapid Metro, and top corporate hubs, it ensures exceptional connectivity. The locality offers world-class infrastructure, upscale social amenities, and a secure environment. Perfect for those seeking prestige, comfort, and long-term value.',
  },
  {
    name: 'Sushant Lok 1',
    image: '/sector-maps/sushant-lok-1.jpg',
    description:
      'Sushant Lok 1 is a prime residential hub offering well-planned plots in the center of Gurgaon. Located near MG Road and major commercial zones, it provides easy access to schools, malls, and metro stations. The area is highly preferred for its vibrant lifestyle and investment potential. Build a custom home in one of Gurgaon\'s most connected neighborhoods.',
  },
  {
    name: 'Sushant Lok 2',
    image: '/sector-maps/sushant-lok-2.jpg',
    description:
      'Discover premium residential plots in Sushant Lok 2, a peaceful and well-connected locality in Gurgaon. Surrounded by top schools, hospitals, and shopping destinations, it offers convenience at every step. The area is known for its wide roads, green spaces, and family-friendly environment. An excellent opportunity for both homeowners and investors.',
  },
  {
    name: 'Sushant Lok 3',
    image: '/sector-maps/sushant-lok-3.jpg',
    description:
      'Sushant Lok 3 offers spacious residential plots in a rapidly growing Gurgaon neighborhood. Enjoy smooth connectivity to Golf Course Extension Road and major business districts. With quality infrastructure and modern social amenities nearby, it is ideal for contemporary living. Invest in a location with strong future appreciation and lifestyle benefits.',
  },
  {
    name: 'South City 1',
    image: '/sector-maps/south-city-1.jpg',
    description:
      'South City 1 is one of Gurgaon\'s most popular residential areas, offering premium plots with excellent connectivity. Located close to NH-48, HUDA City Centre, and major commercial hubs, it ensures convenience and accessibility. The locality features parks, schools, and shopping centers within easy reach. A perfect destination for luxurious and comfortable living.',
  },
  {
    name: 'South City 2',
    image: '/sector-maps/south-city-2.jpg',
    description:
      'Find your ideal residential plot in South City 2, a fast-developing locality known for peaceful surroundings and modern infrastructure. Strategically located near Sohna Road, it offers seamless access to key parts of Gurgaon. The area is surrounded by schools, hospitals, and retail destinations for a comfortable lifestyle. A great investment option with growing demand.',
  },
  {
    name: 'Adani Samsara',
    image: '/sector-maps/adani-samsara.jpg',
    description:
      'Adani Samsara offers premium plotted living with a blend of luxury, privacy, and modern infrastructure. Located in Sector 60 Gurgaon, it provides excellent connectivity to Golf Course Extension Road. The gated community features landscaped greens, security, and premium lifestyle amenities. Build your dream home in a prestigious and future-ready address.',
  },
  {
    name: 'Emaar Emerald Hills',
    image: '/sector-maps/emaar-emerald-hills.jpg',
    description:
      'Emaar Emerald Hills presents exclusive residential plots in a gated community designed for luxury living. Located near Golf Course Extension Road, it offers smooth connectivity to major commercial and lifestyle destinations. The project is known for its serene environment, landscaped greens, and premium infrastructure. A perfect blend of comfort, elegance, and investment potential.',
  },
  {
    name: 'DLF Alameda',
    image: '/sector-maps/dlf-alameda.jpg',
    description:
      'DLF Alameda offers premium residential plots in a low-density luxury township in Sector 73 Gurgaon. The project combines modern infrastructure with lush green surroundings and top-class amenities. With excellent connectivity to NH-48 and SPR Road, it ensures unmatched convenience. Build a sophisticated lifestyle in one of Gurgaon\'s finest plotted communities.',
  },
  {
    name: 'DLF Garden City',
    image: '/sector-maps/dlf-garden-city.jpg',
    description:
      'DLF Garden City is a well-planned township offering premium residential plots in a serene and green environment. Strategically located near New Gurgaon, it provides excellent connectivity and future growth potential. The township features wide roads, parks, and modern civic infrastructure. An ideal investment destination for families seeking quality living.',
  },
  {
    name: 'Central Park Flower Valley',
    image: '/sector-maps/central-park-flower-valley.jpg',
    description:
      'Central Park Flower Valley offers beautifully planned residential plots amidst lush greenery and nature-inspired living. Located on Sohna Road, the township provides seamless connectivity to Gurgaon and Delhi NCR. Enjoy a premium lifestyle with world-class amenities, wellness spaces, and open landscapes. Invest in a serene destination designed for luxury and peace.',
  },
  {
    name: 'Greenwood City',
    image: '/sector-maps/greenwood-city.jpg',
    description:
      'Greenwood City is a well-established residential locality offering premium plots in the heart of Gurgaon. Known for its excellent connectivity and peaceful surroundings, it is ideal for families and investors alike. The area provides easy access to schools, markets, and commercial hubs. Build your dream home in a neighborhood with lasting value.',
  },
  {
    name: 'Rosewood City',
    image: '/sector-maps/rosewood-city.jpg',
    description:
      'Rosewood City offers spacious residential plots in a vibrant and rapidly developing Gurgaon neighborhood. Strategically located near Sohna Road, it ensures smooth connectivity to major business and lifestyle destinations. The locality is known for its green surroundings and modern infrastructure. A great opportunity for comfortable living and strong investment returns.',
  },
  {
    name: 'Malibu Town',
    image: '/sector-maps/malibu-town.jpg',
    description:
      'Malibu Town is a premium residential destination offering well-planned plots in a peaceful and upscale environment. Located close to Sohna Road and Golf Course Extension Road, it ensures excellent accessibility. The area is surrounded by schools, malls, and healthcare facilities for a convenient lifestyle. Invest in a location known for luxury living and appreciation potential.',
  },
  {
    name: 'Nirvana Country',
    image: '/sector-maps/nirvana-country.jpg',
    description:
      'Nirvana Country offers exclusive residential plots in a self-sustained township designed for premium living. Located in Sector 50 Gurgaon, it provides excellent connectivity to Golf Course Extension Road and major hubs. The gated community features lush greenery, modern amenities, and a secure environment. A perfect address for building a luxurious and future-ready home.',
  },
];

const TRUNCATE_LENGTH = 120;

function truncate(text: string) {
  if (text.length <= TRUNCATE_LENGTH) return text;
  return text.slice(0, TRUNCATE_LENGTH).trimEnd() + '...';
}

export default function PlotsGuideClient() {
  const [selected, setSelected] = useState<Plot | null>(null);

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* ── HERO ── */}
        <section className="bg-[#0d1b25] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: text */}
              <div>
                <p className="text-xs font-semibold text-[#feb711] tracking-[0.2em] uppercase mb-3">
                  2026 Investment Guide
                </p>
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                  Residential Plots in <span className="text-[#feb711]">Gurgaon</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
                  Explore detailed sector maps showing layouts, road networks, planning zones, and nearby infrastructure.
                  Use the maps to evaluate connectivity and current property inventory across Gurgaon.
                </p>
              </div>

              {/* Right: visual */}
              <div className="relative w-full aspect-2/1 lg:aspect-auto lg:h-48 xl:h-56">
                <Image
                  src="/residential-plots-hero.png"
                  alt="Stilt plus 4 map approved plots available across Gurgaon"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-right"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plots.map((plot) => (
              <div
                key={plot.name}
                className="bg-white rounded-xl border border-gray-200 hover:border-[#feb711] shadow-sm hover:shadow-[0_4px_20px_rgba(254,183,17,0.2)] overflow-hidden flex flex-col transition-all duration-200"
              >
                {/* Map image */}
                <div className="relative h-52 bg-gray-100">
                  <Image
                    src={plot.image}
                    alt={`${plot.name} sector map`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{plot.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{truncate(plot.description)}</p>
                  <button
                    onClick={() => setSelected(plot)}
                    className="mt-4 w-full py-2.5 rounded-lg bg-[#feb711] text-[#0d1b25] text-sm font-semibold hover:bg-[#e5a50f] transition-colors duration-200"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-2xl border-2 border-[#feb711] overflow-hidden shadow-[0_0_60px_rgba(254,183,17,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#feb711] flex items-center justify-center text-[#0d1b25] hover:bg-[#e5a50f] transition-colors shadow-md"
              aria-label="Close"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1">
              {/* Image */}
              <div className="relative h-60 sm:h-80 bg-gray-100">
                <Image
                  src={selected.image}
                  alt={`${selected.name} sector map`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 672px"
                />
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-[#0d1b25]" />

              {/* Content */}
              <div className="px-6 sm:px-8 pt-6 pb-7 sm:pt-7 sm:pb-9">
                {/* Title with yellow left bar */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="mt-1 w-1 min-h-full shrink-0 self-stretch rounded-full bg-[#feb711]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b25] leading-snug">
                    {selected.name}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {selected.description}
                </p>

                {/* Footer label */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#feb711]" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Sector Map · Gurgaon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
