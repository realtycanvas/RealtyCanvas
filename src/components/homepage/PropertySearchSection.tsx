'use client';

import PropertySearchBar from '@/components/PropertySearchBar';

export default function PropertySearchSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Your
            <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
              {" "}
              Property Search
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find your perfect property with our advanced search filters
          </p>
        </div>
        <PropertySearchBar
          onSearch={(filters) => {
            // Navigate to search results page with filters
            const params = new URLSearchParams({
              type: filters.type,
              location: filters.location,
              propertyType: filters.propertyType,
              minPrice: filters.priceRange.min.toString(),
              maxPrice: filters.priceRange.max.toString(),
            });
            window.location.href = `/properties/search?${params.toString()}`;
          }}
        />
      </div>
    </section>
  );
}