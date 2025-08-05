'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { truncateText } from '@/utils/strip-html';
import { BrandButton } from './ui/BrandButton';

interface PropertyListingCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    currency: string;
    featuredImage: string;
    beds: number;
    baths: number;
    area: number;
    potentialCashflow?: number;
    potentialYield?: number;
    potentialValue?: number;
  };
}

export default function PropertyListingCard({ property }: PropertyListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = (price: number) => {
    // Convert to Indian format (Lakhs)
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative">
        <Image
          src={property.featuredImage}
          alt={property.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-lg">
          {formatPrice(property.price)}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isFavorited ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Address */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.address}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-3 space-x-3">
          <span>{property.beds} beds</span>
          <span>{property.baths} baths</span>
          <span>{property.area} m²</span>
        </div>

        {/* Investment Details */}
        <div className="flex-1">
          {(property.potentialCashflow || property.potentialYield || property.potentialValue) && (
            <div className="space-y-1 mb-3">
              {property.potentialCashflow && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Cashflow</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{formatNumber(property.potentialCashflow)}
                  </span>
                </div>
              )}
              {property.potentialYield && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Yield</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.potentialYield.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={`/properties/${property.id}`}
          className="block mt-auto no-underline hover:no-underline focus:no-underline"
        >
          <BrandButton
            variant="primary"
            size="sm"
            className="w-full rounded-lg text-sm text-center"
          >
            View Details
          </BrandButton>
        </Link>
      </div>
    </div>
  );
}