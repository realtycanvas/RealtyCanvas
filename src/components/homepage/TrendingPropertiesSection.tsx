'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { BrandButton } from '../ui/BrandButton';
import { FireIcon } from '@heroicons/react/24/solid';

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  featuredImage: string;
  galleryImages: string[];
  beds: number;
  baths: number;
  area: number;
  createdAt: Date;
};

interface TrendingPropertiesSectionProps {
  properties?: Property[]; // Make optional since we'll fetch trending data
  loading?: boolean;
}

export default function TrendingPropertiesSection({ properties = [], loading = false }: TrendingPropertiesSectionProps) {
  const [trendingProperties, setTrendingProperties] = useState<Property[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProperties = async () => {
      try {
        const response = await fetch('/api/properties/trending?limit=6&days=7');
        if (response.ok) {
          const data = await response.json();
          // Convert createdAt strings to Date objects
          const formattedData = data.map((property: any) => ({
            ...property,
            createdAt: new Date(property.createdAt),
          }));
          setTrendingProperties(formattedData);
        } else {
          // Fallback to regular properties if trending API fails
          const fallbackProperties = properties
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6);
          setTrendingProperties(fallbackProperties);
        }
      } catch (error) {
        console.error('Error fetching trending properties:', error);
        // Fallback to regular properties
        const fallbackProperties = properties
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
        setTrendingProperties(fallbackProperties);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingProperties();
  }, [properties]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <FireIcon className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Trending
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {" "}
                Properties
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore the most popular and recently added properties that are gaining attention from buyers and investors
          </p>
        </div>

        {(loading || trendingLoading) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : trendingProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {trendingProperties.map((property, index) => (
                <div key={property.id} className="relative">
                  {/* Trending Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                      <FireIcon className="w-3 h-3 mr-1" />
                      #{index + 1} Trending
                    </div>
                  )}
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/properties">
                <BrandButton
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none"
                >
                  <FireIcon className="mr-2 w-5 h-5" />
                  View All Properties
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </BrandButton>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FireIcon className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No trending properties yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Be the first to list a property and start the trend!
            </p>
            <Link
              href="/properties/new"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 no-underline hover:no-underline focus:no-underline"
            >
              <FireIcon className="mr-2 w-5 h-5" />
              List Your Property
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}