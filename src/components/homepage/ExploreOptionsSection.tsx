import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type ExploreLinkItem = {
  title: string;
  description: string;
  href: string;
};

type ExploreCard = {
  title: string;
  subtitle: string;
  countLabel: string;
  href: string;
  imageUrl: string;
};

export default function ExploreOptionsSection({
  heading,
  locationName,
  items,
  cards,
}: {
  heading: string;
  locationName: string;
  items: ExploreLinkItem[];
  cards: ExploreCard[];
}) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {heading} in {locationName}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <details
                      key={item.title}
                      open={idx === 0}
                      className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <summary className="list-none cursor-pointer flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4">
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                          View All
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {cards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-900 min-h-[260px] md:min-h-[320px]"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="text-xs font-semibold text-white/90 mb-1">
                        {card.countLabel}
                      </div>
                      <div className="text-lg font-bold text-white leading-snug">
                        {card.title}
                      </div>
                      <div className="text-sm text-white/80">{card.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

