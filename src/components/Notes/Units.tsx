import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  category: string;
  status: string;
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  galleryImages: string[];
  reraId?: string | null;
  developerName?: string | null;
  possessionDate?: string | null;
  basePrice?: number | string | null;
  priceRange?: string | null;
  minRatePsf?: number | string | null;
  maxRatePsf?: number | string | null;
  latitude?: number | null;
  longitude?: number | null;
  sitePlanImage?: string | null;
  units: Unit[];
  videoUrl?: string | null;
  videoUrls?: string[];
};

type Unit = {
  id: string;
  unitNumber: string;
  type: string;
  floor: string;
  areaSqFt: number;
  ratePsf?: number | null;
  priceTotal?: number | null;
  availability: string;
  notes?: string | null;
};

interface UnitsSectionProps {
  project: Project;
}

export default function UnitsSection({ project }: UnitsSectionProps) {
  const unitsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const unitsPerPage = 10;

  const totalUnits = project.units?.length ?? 0;
  const startIndex = (currentPage - 1) * unitsPerPage;
  const endIndex = currentPage * unitsPerPage;
  const currentUnits = project.units?.slice(startIndex, endIndex) ?? [];

  // Only show units table for residential projects
  const isResidential = project.category?.toUpperCase() === 'RESIDENTIAL';

  // Don't render anything for commercial projects
  if (!isResidential) {
    return null;
  }

  return (
    <div
      ref={unitsRef}
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Total Units
      </h2>

      {totalUnits > 0 ? (
        <div className="overflow-x-auto max-w-full">
          {!isMobile ? (
            <div className="grid grid-cols-7 gap-4 min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {/* Header Row */}
              <div className="col-span-7 grid grid-cols-6 bg-gray-50 dark:bg-gray-900">
                {["Unit", "Type", "Floor", "Area", "Price", "Status"].map(
                  (heading) => (
                    <div
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider break-words"
                    >
                      {heading}
                    </div>
                  )
                )}
              </div>

              {/* Data Rows */}
              {currentUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="col-span-7 grid grid-cols-6 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white break-words">
                    {unit.unitNumber}
                  </div>
                  <div className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                    {unit.type}
                  </div>
                  <div className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                    {unit.floor}
                  </div>
                  <div className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                    {unit.areaSqFt.toLocaleString()} sq ft
                  </div>
                  <div className="px-6 py-4 text-xs font-medium text-gray-900 dark:text-white break-words">
                    {unit.priceTotal
                      ? `₹${(unit.priceTotal / 100000).toFixed(1)}L`
                      : unit.ratePsf
                      ? `₹${unit.ratePsf}/sq ft`
                      : "Price on Request"}
                  </div>
                  <div className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        unit.availability === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : unit.availability === "HOLD"
                          ? "bg-yellow-100 text-yellow-800"
                          : unit.availability === "SOLD"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {unit.availability}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mobile card layout
            <div className="space-y-4">
              {currentUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{unit.unitNumber}</span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        unit.availability === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : unit.availability === "HOLD"
                          ? "bg-yellow-100 text-yellow-800"
                          : unit.availability === "SOLD"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {unit.availability}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Type</span>
                      <span className="text-gray-900 dark:text-white">{unit.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Floor</span>
                      <span className="text-gray-900 dark:text-white">{unit.floor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Area</span>
                      <span className="text-gray-900 dark:text-white">{unit.areaSqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Price</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {unit.priceTotal
                          ? `₹${(unit.priceTotal / 100000).toFixed(1)}L`
                          : unit.ratePsf
                          ? `₹${unit.ratePsf}/sq ft`
                          : "Price on Request"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No units available
        </p>
      )}

      {/* Pagination Controls */}
      {totalUnits > unitsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {Math.min(startIndex + 1, totalUnits)} to{" "}
            {Math.min(endIndex, totalUnits)} of {totalUnits} units
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(totalUnits / unitsPerPage))
                )
              }
              disabled={currentPage >= Math.ceil(totalUnits / unitsPerPage)}
              className={`px-3 py-1 rounded ${
                currentPage >= Math.ceil(totalUnits / unitsPerPage)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
