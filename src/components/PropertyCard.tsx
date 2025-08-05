'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageCarousel from './ImageCarousel';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { stripHtml, truncateText } from '@/utils/strip-html';
import { BrandButton } from './ui/BrandButton';

// Define Property type directly since generated Prisma types aren't available
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

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Prepare images array for carousel
  const images = [];
  if (property.featuredImage) {
    images.push(property.featuredImage);
  }
  if (property.galleryImages && property.galleryImages.length > 0) {
    images.push(...property.galleryImages);
  }
  
  // If no images available, use placeholder
  if (images.length === 0) {
    images.push('/placeholder-property.svg');
  }

  // Format price in Indian format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  // Generate key features based on property data
  const keyFeatures = [
    `${property.beds} Beds`,
    `${property.area} m²`,
    'Parking',
  ].slice(0, 3); // Show only 3 features to maintain consistent height

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Link href={`/properties/${property.id}`} className="block h-full no-underline hover:no-underline focus:no-underline">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full group cursor-pointer flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <ImageCarousel 
            images={images} 
            title={property.title} 
            autoplay={true} 
            loop={true}
            showArrows={false}
          />
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl font-bold text-sm">
            {formatPrice(property.price)}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 z-10"
          >
            {isFavorited ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors min-h-[3.5rem]">
            {property.title}
          </h3>
          
          {/* Address */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-1">
            {property.address}
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap gap-2 mb-3">
            {keyFeatures.map((feature, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Price below description */}
          <div className="mb-4 mt-auto">
            <span className="text-xl font-bold text-brand-primary dark:text-brand-primary">
              {formatPrice(property.price)}
            </span>
          </div>

          {/* View Details Button */}
                      <BrandButton
              variant="primary"
              size="sm"
              className="w-full rounded-xl text-sm"
            >
              View Details
            </BrandButton>
        </div>
      </div>
    </Link>
  );
}