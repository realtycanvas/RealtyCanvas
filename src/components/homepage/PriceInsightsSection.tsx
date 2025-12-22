import Link from "next/link";
import {
  ChartBarIcon,
  ArrowsRightLeftIcon,
  HomeModernIcon,
  MapPinIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type MicromarketRow = { name: string; avgTicketSizeRupees: number | null };
type RentalRow = { label: string; count: number };

function formatRupeesShort(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  if (value >= 100_000) return `₹${Math.round(value / 100_000)} L`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export default function PriceInsightsSection({
  locationName,
  totalProjects,
  geocodedProjects,
  medianTicketSizeRupees,
  micromarkets,
  rentalSupply,
}: {
  locationName: string;
  totalProjects: number;
  geocodedProjects: number;
  medianTicketSizeRupees: number | null;
  micromarkets: MicromarketRow[];
  rentalSupply: RentalRow[];
}) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Property Price Insights in {locationName}
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-4xl">
              Discover key market signals from recent Realty Canvas listings, including pricing spread across micromarkets and supply patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/projects?city=${encodeURIComponent(locationName)}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-brand-primary" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
              </div>
              <div className="mt-4 font-semibold text-gray-900 dark:text-white">
                Property Rates Coverage
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {geocodedProjects.toLocaleString("en-IN")} mapped projects out of{" "}
                {totalProjects.toLocaleString("en-IN")} listings.
              </div>
              <div className="mt-4 text-sm font-semibold text-brand-primary">
                Explore Now
              </div>
            </Link>

            <Link
              href={`/projects?city=${encodeURIComponent(locationName)}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
              </div>
              <div className="mt-4 font-semibold text-gray-900 dark:text-white">
                Asking Price (Median)
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Recent median ticket size:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatRupeesShort(medianTicketSizeRupees)}
                </span>
              </div>
              <div className="mt-4 text-sm font-semibold text-brand-primary">
                View Listings
              </div>
            </Link>

            <Link
              href={`/projects?city=${encodeURIComponent(locationName)}`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <ArrowsRightLeftIcon className="w-5 h-5 text-purple-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
              </div>
              <div className="mt-4 font-semibold text-gray-900 dark:text-white">
                Micromarket Comparison
              </div>
              <div className="mt-3 space-y-2">
                {micromarkets.length ? (
                  micromarkets.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-200 truncate">
                        {row.name}
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {formatRupeesShort(row.avgTicketSizeRupees)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Data updating.
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm font-semibold text-brand-primary">
                Compare Areas
              </div>
            </Link>

            <Link
              href={`/projects?city=${encodeURIComponent(locationName)}&category=COMMERCIAL`}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <HomeModernIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
              </div>
              <div className="mt-4 font-semibold text-gray-900 dark:text-white">
                Rental Supply (Available)
              </div>
              <div className="mt-3 space-y-2">
                {rentalSupply.length ? (
                  rentalSupply.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-200">
                        {row.label}
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {row.count.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Data updating.
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm font-semibold text-brand-primary">
                View Supply
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

