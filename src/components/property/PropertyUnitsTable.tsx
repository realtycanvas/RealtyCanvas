'use client';

import { useState, useEffect } from 'react';

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

interface PropertyUnitsTableProps {
  units: Unit[];
  className?: string;
}

export default function PropertyUnitsTable({ units, className = '' }: PropertyUnitsTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const unitsPerPage = 10;
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Sort units numerically by unitNumber
  const sortedUnits = units?.sort((a, b) => {
    const aNum = parseInt(a.unitNumber) || 0;
    const bNum = parseInt(b.unitNumber) || 0;
    if (aNum !== bNum) {
      return aNum - bNum;
    }
    // If unit numbers are the same, sort by floor
    return a.floor.localeCompare(b.floor);
  }) ?? [];

  const totalUnits = sortedUnits.length;
  const startIndex = (currentPage - 1) * unitsPerPage;
  const endIndex = currentPage * unitsPerPage;
  const currentUnits = sortedUnits.slice(startIndex, endIndex);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Total Units
      </h2>

      {totalUnits > 0 ? (
        <div className="overflow-x-auto max-w-full">
          {!isMobile ? (
            // Desktop version - Standard table layout
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed md:table-auto">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {["Unit", "Type", "Floor", "Area", "Price", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider break-words"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentUnits.map((unit) => (
                  <tr 
                    key={unit.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white break-words">
                      {unit.unitNumber}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                      {unit.type}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                      {unit.floor}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 break-words">
                      {unit.areaSqFt.toLocaleString()} sq ft
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-900 dark:text-white break-words">
                      {unit.priceTotal
                        ? `₹${(unit.priceTotal / 100000).toFixed(1)}L`
                        : unit.ratePsf
                        ? `₹${unit.ratePsf}/sq ft`
                        : "Price on Request"}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Mobile version - Card-based layout
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
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{unit.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Floor:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{unit.floor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Area:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{unit.areaSqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Price:</span>
                      <span className="ml-2 text-gray-900 dark:text-white font-medium">
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