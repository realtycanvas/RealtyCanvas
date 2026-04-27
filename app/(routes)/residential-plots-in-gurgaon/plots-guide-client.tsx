'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PlusIcon, MinusIcon, BuildingOffice2Icon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

type LocationCard = {
  id: number;
  badge: string;
  badgeColor: string;
  location: string;
  subtitle: string;
  description: string;
  images: { src: string; alt: string }[];
  projects: string[];
  whyInvest: string[];
  bestFor: string;
  priceRange: string;
};

const locationCards: LocationCard[] = [
  {
    id: 1,
    badge: 'LUXURY',
    badgeColor: '#feb711',
    location: 'DLF Phases',
    subtitle: 'Ultra Prime Living',
    description:
      'The gold standard of Gurgaon real estate. DLF phases represent the most sought-after addresses for ultra-premium plots and independent living in India\'s millennium city.',
    images: [
      { src: '/residential-plots/1/Picture1.jpg', alt: 'DLF Phases Gurgaon aerial view' },
      { src: '/residential-plots/1/Picture2.jpg', alt: 'DLF Phase residential towers' },
      { src: '/residential-plots/1/Picture3.jpg', alt: 'DLF location map' },
      { src: '/residential-plots/1/Picture4.jpg', alt: 'DLF luxury complex with gardens' },
      { src: '/residential-plots/1/Picture5.jpg', alt: 'DLF Golf & Country Club' },
      { src: '/residential-plots/1/Picture6.jpg', alt: 'DLF Phase 5 master plan' },
    ],
    projects: ['DLF Phase 1', 'DLF Phase 2', 'DLF Phase 4', 'DLF Phase 5'],
    whyInvest: [
      'Established luxury neighbourhoods with 30+ years of premium development',
      'Direct proximity to Golf Course Road and top commercial zones',
      'Strong resale demand — near-zero vacancy in prime pockets',
      'Highest land appreciation track record in entire Gurgaon',
    ],
    bestFor: 'End-users + ultra HNI investors',
    priceRange: '₹3L – ₹8L+ per sq. yard',
  },
  {
    id: 2,
    badge: 'GROWTH',
    badgeColor: '#4ade80',
    location: 'New Gurgaon & Townships',
    subtitle: 'Planned Infrastructure, Rising Value',
    description:
      'New Gurgaon offers the best balance between accessible entry prices and strong future appreciation. Large-format township developments with complete infrastructure and gated amenities.',
    images: [
      { src: '/residential-plots/2/Picture7.jpg',  alt: 'New Gurgaon township development' },
      { src: '/residential-plots/2/Picture8.jpg',  alt: 'BPTP Amstoria residential complex' },
      { src: '/residential-plots/2/Picture9.jpg',  alt: 'New Gurgaon planned community' },
      { src: '/residential-plots/2/Picture10.jpg', alt: 'Township gated community' },
      { src: '/residential-plots/2/Picture11.jpg', alt: 'BPTP Astaire Gardens' },
      { src: '/residential-plots/2/Picture12.jpg', alt: 'Emerald Estate development' },
      { src: '/residential-plots/2/Picture13.jpg', alt: 'New Gurgaon infrastructure' },
      { src: '/residential-plots/2/Picture14.jpg', alt: 'Township aerial overview' },
    ],
    projects: ['BPTP Amstoria', 'BPTP Astaire Gardens', 'Emerald Estate'],
    whyInvest: [
      'Planned infrastructure — wide roads, green corridors and full utilities',
      'Lower entry price vs DLF, ideal for mid-budget investors',
      'High appreciation potential as sectors mature over 5–7 years',
      'Gated communities with complete amenities and 24/7 security',
    ],
    bestFor: 'Mid-budget investors seeking 5–7 year growth',
    priceRange: '₹80K – ₹1.5L per sq. yard',
  },
  {
    id: 3,
    badge: 'CORRIDOR',
    badgeColor: '#60a5fa',
    location: 'Dwarka Expressway',
    subtitle: 'Infrastructure-Led Appreciation',
    description:
      "One of NCR's fastest-appreciating corridors. Direct Delhi connectivity, a completed expressway and premium plotted communities make this the most compelling mid-to-long term bet in Gurgaon.",
    images: [
      { src: '/residential-plots/3/Picture15.jpg', alt: 'Dwarka Expressway corridor development' },
      { src: '/residential-plots/3/Picture16.jpg', alt: 'Experion Westerlies plotted community' },
      { src: '/residential-plots/3/Picture17.jpg', alt: 'Adani Samsara Sector 63' },
      { src: '/residential-plots/3/Picture18.jpg', alt: 'DLF Alameda Dwarka Expressway' },
      { src: '/residential-plots/3/Picture19.jpg', alt: 'Premium plotted development' },
      { src: '/residential-plots/3/Picture20.jpg', alt: 'Dwarka Expressway infrastructure' },
    ],
    projects: ['Experion Westerlies', 'Adani Samsara Sector 63', 'DLF Alameda'],
    whyInvest: [
      'Direct connectivity to Delhi via fully operational Dwarka Expressway',
      'Metro expansion and NH-48 access driving footfall and demand',
      'Premium plotted communities with resort-style amenities',
      'Benchmark appreciation since expressway infrastructure completion',
    ],
    bestFor: 'Future appreciation seekers with a 5–10 year investment horizon',
    priceRange: '₹1.2L – ₹2.5L per sq. yard',
  },
  {
    id: 4,
    badge: 'PREMIUM',
    badgeColor: '#c084fc',
    location: 'Golf Course Road',
    subtitle: 'Emerging Luxury-Commercial Hub',
    description:
      "Golf Course Extension Road is rapidly transforming into Gurgaon's next premium destination — combining high-footfall retail, luxury residential supply and strong rental yield potential in a single corridor.",
    images: [
      {
        src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Commercial development Golf Course Road',
      },
      {
        src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
        alt: 'Premium business district',
      },
      {
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        alt: 'Modern commercial tech park',
      },
      {
        src: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=600&q=80',
        alt: 'Premium commercial real estate',
      },
      {
        src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
        alt: 'Mixed-use luxury development',
      },
    ],
    projects: ['BPTP Downtown 66', 'M3M Jewel', 'Tarc Ishva', 'M3M Route 66'],
    whyInvest: [
      'Emerging luxury-commercial hub along Golf Course Extension Road',
      'High-visibility retail & mixed-use developments driving strong footfall',
      'Excellent connectivity to Golf Course Road, Sohna Road & NH-48',
      'Dense premium residential supply generating strong rental catchment',
      'Strong potential for both rental yield and long-term capital appreciation',
    ],
    bestFor: 'Retail investors, HNI buyers & commercial asset acquirers',
    priceRange: '₹2L – ₹4L per sq. yard',
  },
];

const reasons = [
  {
    number: '01',
    title: 'Land Scarcity in Prime Gurgaon',
    description:
      'Areas like DLF Phase 1 and DLF Phase 5 are already saturated, pushing buyers toward premium plotted developments in the next growth rings.',
  },
  {
    number: '02',
    title: 'Shift Toward Independent Living',
    description:
      'Post-pandemic demand for villas and low-density housing has increased significantly. Buyers now prioritise full control over their living environment.',
  },
  {
    number: '03',
    title: 'Builder Floor Boom',
    description:
      'Plots allow construction of 3–4 floors, creating a powerful rental income model that apartment units simply cannot match for long-term returns.',
  },
  {
    number: '04',
    title: 'Infrastructure Growth',
    description:
      'Dwarka Expressway completion, metro expansion, SPR and NH-48 connectivity are unlocking entirely new corridors for premium plot investment.',
  },
];

const priceTrends = [
  { location: 'DLF Phases', range: '₹3L – ₹8L+', trend: '↑ High' },
  { location: 'Golf Course Extension', range: '₹2L – ₹4L', trend: '↑ Strong' },
  { location: 'Dwarka Expressway', range: '₹1.2L – ₹2.5L', trend: '↑ Rising' },
  { location: 'New Gurgaon', range: '₹80K – ₹1.5L', trend: '↑ Emerging' },
];

const faqs = [
  {
    question: 'Which are the best areas for premium plots in Gurgaon?',
    answer:
      'DLF Phases are still the top pick if you are looking for established luxury and exclusivity. If your focus is on future growth, Dwarka Expressway and Golf Course Extension Road are strong options with a lot of new development coming up.',
  },
  {
    question: 'Are plotted developments a good investment in Gurgaon?',
    answer:
      'Yes, they are considered one of the strongest long-term investments. Land is limited, especially in prime locations, and it gives you the flexibility to build a home exactly the way you want.',
  },
  {
    question: 'What is the investment range for premium plots in Gurgaon?',
    answer:
      'In developing areas like New Gurgaon, prices usually start around ₹80,000 per sq. yard. In prime locations like DLF Phases, prices can go up to ₹2 to 3.5 crore per sq. yard or even higher.',
  },
  {
    question: 'Should I invest in a plot or a luxury apartment in Gurgaon?',
    answer:
      'If you are looking at long-term appreciation and want full control over your space, plots are a better choice. Apartments are more suitable if you want something ready to move in or are looking for rental income in the near term.',
  },
];

function AccordionPanel({
  label,
  icon,
  subtitle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-300 ${
        open ? 'border-[#feb711]/50 shadow-[0_0_20px_rgba(254,183,17,0.08)]' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200 ${
          open ? 'bg-[#feb711]/8' : 'bg-white/5 hover:bg-white/8'
        }`}
      >
        {/* Icon pill */}
        <span
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            open ? 'bg-[#feb711] text-[#0d1b25]' : 'bg-white/10 text-[#feb711]'
          }`}
        >
          {icon}
        </span>

        {/* Label + subtitle */}
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-white text-sm md:text-base leading-tight">{label}</span>
          <span className="block text-xs text-gray-500 mt-0.5 truncate">{subtitle}</span>
        </span>

        {/* Toggle circle */}
        <span
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
            open ? 'bg-[#feb711] border-[#feb711] text-[#0d1b25]' : 'border-[#feb711]/50 text-[#feb711]'
          }`}
          aria-hidden
        >
          {open ? <MinusIcon className="w-3.5 h-3.5" /> : <PlusIcon className="w-3.5 h-3.5" />}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-[#feb711]/20 bg-[#feb711]/5">{children}</div>
      )}
    </div>
  );
}

export default function PlotsGuideClient() {
  const [activeImages, setActiveImages] = useState<number[]>(locationCards.map(() => 0));
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const setActiveImage = (cardIdx: number, imgIdx: number) => {
    setActiveImages((prev) => {
      const next = [...prev];
      next[cardIdx] = imgIdx;
      return next;
    });
  };

  return (
    <div className="bg-[#0d1b25] overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold text-[#feb711] tracking-[0.25em] uppercase mb-4 sm:mb-5 px-4 py-1.5 rounded-full border border-[#feb711]/30 bg-[#feb711]/5">
            2026 Investment Guide
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Residential Plots in{' '}
            <span className="text-[#feb711]">Gurgaon</span>
            <br className="hidden sm:block" />
            {' '}Top Locations, Prices &amp; Premium Projects
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
            Gurgaon has become one of India&apos;s most sought-after real estate destinations. Residential plots are
            now leading the investment wave — especially in DLF phases, Dwarka Expressway, and New Gurgaon.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {['Full Ownership Control', 'Higher Appreciation Potential', 'Flexibility to Build'].map((benefit) => (
              <span
                key={benefit}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#feb711]/40 text-[#feb711] text-xs sm:text-sm font-medium bg-[#feb711]/5"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HIGH DEMAND ── */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12">
            <span className="text-xs font-semibold text-[#feb711] tracking-[0.2em] uppercase mb-3 block">
              Market Drivers
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d1b25]">
              Why Residential Plots in Gurgaon{' '}
              <span className="text-[#feb711]">Are in High Demand</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reasons.map((r) => (
              <div
                key={r.number}
                className="relative p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-[#feb711]/50 transition-all duration-200 group overflow-hidden"
              >
                {/* Gold left-border accent */}
                <span className="absolute left-0 top-0 h-full w-1 bg-[#feb711] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="block text-5xl md:text-6xl font-extrabold text-[#feb711]/25 group-hover:text-[#feb711]/40 transition-colors duration-200 mb-3 leading-none select-none">
                  {r.number}
                </span>
                <h3 className="text-sm md:text-base font-semibold text-[#0d1b25] mb-2">{r.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT LOCATION CARDS ── */}
      {locationCards.slice(0, 3).map((card, cardIdx) => (
        <section
          key={card.id}
          id={`location-${card.id}`}
          className="min-h-screen flex flex-col justify-center py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden"
        >
          {/* Large watermark number — absolute, right side */}
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[180px] md:text-[260px] font-black leading-none select-none pointer-events-none hidden lg:block"
            style={{ color: card.badgeColor + '08' }}
          >
            0{cardIdx + 1}
          </span>

          <div className="max-w-7xl mx-auto w-full relative">

            {/* ── Header ── */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              {/* Top row: index line + badge + price */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[#feb711]/50 text-xs sm:text-sm font-mono font-bold tabular-nums">
                    0{cardIdx + 1}
                  </span>
                  <span className="w-6 sm:w-8 h-px bg-[#feb711]/30" />
                  <span
                    className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full"
                    style={{
                      color: card.badgeColor,
                      backgroundColor: card.badgeColor + '18',
                      border: `1px solid ${card.badgeColor}35`,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
                {/* Price badge — visible sm+ on right; hidden xs, shown below on mobile */}
                <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#feb711]/10 border border-[#feb711]/30 text-[#feb711] text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
                  </svg>
                  {card.priceRange}
                </span>
              </div>

              {/* Location title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-1.5 sm:mb-2">
                {card.location}
              </h2>
              <p className="text-[#feb711]/70 text-xs sm:text-sm font-medium uppercase tracking-widest">
                {card.subtitle}
              </p>
            </div>

            {/* ── Description ── */}
            <p className="text-gray-400 text-sm md:text-base mb-4 sm:mb-5 md:mb-7 max-w-2xl leading-relaxed pl-3 sm:pl-4 border-l-2 border-[#feb711]/30">
              {card.description}
            </p>

            {/* ── Image gallery ── */}
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 mb-4 sm:mb-5 md:mb-7 lg:mb-8">

              {/* Main image */}
              <div className="flex-1 relative aspect-4/3 sm:aspect-auto sm:h-72 md:h-96 lg:h-110 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-800 min-w-0 shadow-2xl">
                <Image
                  src={card.images[activeImages[cardIdx]].src}
                  alt={card.images[activeImages[cardIdx]].alt}
                  fill
                  quality={100}
                  className="object-contain transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 65vw"
                  priority={cardIdx === 0}
                />
                {/* Bottom gradient for text overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                {/* Location name etched on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-lg">
                        {card.location}
                      </p>
                      <p className="text-gray-300 text-xs mt-0.5 drop-shadow">{card.subtitle}</p>
                    </div>
                    {/* Image counter */}
                    <span className="text-xs text-white/60 font-mono tabular-nums bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      {activeImages[cardIdx] + 1} / {card.images.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:w-28 lg:w-36 shrink-0 pb-2 md:pb-0 md:max-h-96 lg:max-h-110 scrollbar-thin">
                {card.images.map((img, imgIdx) => (
                  <button
                    key={imgIdx}
                    type="button"
                    onClick={() => setActiveImage(cardIdx, imgIdx)}
                    className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 md:w-full md:h-22 lg:h-24 rounded-lg md:rounded-xl overflow-hidden transition-all duration-200 focus:outline-none group ${
                      activeImages[cardIdx] === imgIdx
                        ? 'ring-2 ring-[#feb711] ring-offset-2 ring-offset-[#0d1b25] opacity-100 scale-[1.02]'
                        : 'opacity-45 hover:opacity-80 hover:scale-[1.02]'
                    }`}
                    aria-label={`View image ${imgIdx + 1}`}
                  >
                    <Image src={img.src} alt={img.alt} fill quality={100} className="object-cover" sizes="(max-width: 768px) 96px, 144px" />
                    {/* Active indicator dot */}
                    {activeImages[cardIdx] === imgIdx && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#feb711] shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price badge — only on xs (below sm where it's in the header) */}
            <div className="flex items-center gap-2 mb-4 sm:hidden">
              <span className="inline-flex items-center gap-1.5 bg-[#feb711]/10 border border-[#feb711]/30 text-[#feb711] text-xs font-bold px-4 py-1.5 rounded-full">
                {card.priceRange}
              </span>
            </div>

            {/* Accordions — side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <AccordionPanel
                label="Projects"
                icon={<BuildingOffice2Icon className="w-5 h-5" />}
                subtitle="Key developments in this corridor"
              >
                <ul className="space-y-2.5">
                  {card.projects.map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#feb711] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </AccordionPanel>

              <AccordionPanel
                label="Why Invest"
                icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
                subtitle="Investment thesis & returns"
              >
                <ul className="space-y-2.5">
                  {card.whyInvest.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#feb711] shrink-0 mt-1.25" />
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#feb711] font-semibold uppercase tracking-wider border-t border-[#feb711]/20 pt-3">
                  Best for: {card.bestFor}
                </p>
              </AccordionPanel>
            </div>

          </div>
        </section>
      ))}

      {/* ── PRICE TRENDS TABLE ── */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-7 md:mb-10">
            <span className="text-xs font-semibold text-[#feb711] tracking-[0.2em] uppercase mb-3 block">
              Market Pricing 2026
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d1b25]">
              Price Trends of Residential Plots in Gurgaon
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xl">
              Premium plotted areas like DLF phases command top-tier pricing due to land scarcity and established
              infrastructure.
            </p>
          </div>
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {priceTrends.map((row, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0d1b25] text-sm leading-tight">{row.location}</p>
                  <p className="text-gray-500 text-xs mt-1">{row.range} <span className="text-gray-400">/ sq. yard</span></p>
                </div>
                <span className="shrink-0 ml-3 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  {row.trend}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0d1b25] text-white">
                  <th className="px-6 py-4 text-sm font-semibold">Location</th>
                  <th className="px-6 py-4 text-sm font-semibold">Price Range (Per Sq. Yard)</th>
                  <th className="px-6 py-4 text-sm font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {priceTrends.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 font-medium text-[#0d1b25] text-sm">{row.location}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{row.range}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                        {row.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── LEGAL CHECKLIST ── */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1b25]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-semibold text-[#feb711] tracking-[0.2em] uppercase mb-3 block">
                Due Diligence
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                Legal & Buying Checklist
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Before purchasing any plot in Gurgaon, ensure every item on this checklist is verified. This protects
                your investment and prevents legal complications post-purchase.
              </p>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {[
                'Verify title ownership and the full ownership chain',
                'Check RERA registration status of the project',
                'Confirm land use approval (residential / commercial)',
                'Ensure registry & mutation documents are clear',
                'Validate builder or developer reputation and track record',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="w-5 h-5 rounded-full bg-[#feb711] flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-[#0d1b25]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-semibold text-[#feb711] tracking-[0.2em] uppercase mb-3 block">
              Common Questions
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d1b25]">
              Frequently Asked{' '}
              <span className="text-[#feb711]">Questions</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0d1b25] text-sm md:text-base pr-3 sm:pr-4">{faq.question}</span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full border border-[#feb711]/60 flex items-center justify-center text-[#feb711]"
                    aria-hidden
                  >
                    {openFaq === i ? (
                      <MinusIcon className="w-3.5 h-3.5" />
                    ) : (
                      <PlusIcon className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 py-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
