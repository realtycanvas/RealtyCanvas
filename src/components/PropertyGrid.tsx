'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface PropertyGridProps {
  title?: string;
  subtitle?: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  beds: number;
  baths: number;
  area: number;
  image: string;
  isHot?: boolean;
  network?: string;
  category?: string;
  isFavorited?: boolean;
}

const cities = [
  { id: 'mumbai', name: 'Mumbai', active: true },
  { id: 'delhi', name: 'Delhi', active: false },
  { id: 'bangalore', name: 'Bangalore', active: false },
  { id: 'gurugram', name: 'Gurugram', active: false },
];

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Best Western Cedars Hotel',
    location: 'Mumbai, Maharashtra',
    price: 28,
    rating: 4.8,
    reviews: 28,
    beds: 2,
    baths: 3,
    area: 100,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    isHot: true,
    network: '4 Network',
    category: 'Family',
  },
  {
    id: '2',
    title: 'Bell By Greene King Inns',
    location: 'Mumbai, Maharashtra',
    price: 250,
    rating: 4.4,
    reviews: 108,
    beds: 3,
    baths: 7,
    area: 100,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    network: '4 Network',
    category: 'Family',
  },
  {
    id: '3',
    title: 'Half Moon, Sherborne By Marston\'s Inns',
    location: 'Mumbai, Maharashtra',
    price: 278,
    rating: 3.8,
    reviews: 16,
    beds: 5,
    baths: 3,
    area: 100,
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg',
    network: '4 Network',
    category: 'Family',
    isFavorited: true,
  },
  {
    id: '4',
    title: 'White Horse Hotel By Greene King Inns',
    location: 'Mumbai, Maharashtra',
    price: 40,
    rating: 4.8,
    reviews: 34,
    beds: 7,
    baths: 5,
    area: 100,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    network: '4 Network',
    category: 'Family',
  },
  {
    id: '5',
    title: 'Ship And Castle Hotel',
    location: 'Mumbai, Maharashtra',
    price: 149,
    rating: 3.4,
    reviews: 340,
    beds: 3,
    baths: 2,
    area: 100,
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
    isHot: true,
    network: '4 Network',
    category: 'Family',
  },
  {
    id: '6',
    title: 'The Windmill Family & Commercial Hotel',
    location: 'Mumbai, Maharashtra',
    price: 90,
    rating: 3.8,
    reviews: 508,
    beds: 7,
    baths: 3,
    area: 100,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    network: '4 Network',
    category: 'Family',
    isFavorited: true,
  },
  {
    id: '7',
    title: 'Unicorn, Gunthorpe By Marston\'s Inns',
    location: 'Mumbai, Maharashtra',
    price: 252,
    rating: 3.0,
    reviews: 481,
    beds: 2,
    baths: 5,
    area: 100,
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    isHot: true,
    network: '4 Network',
    category: 'Family',
  },
  {
    id: '8',
    title: 'Holiday Inn Express Ramsgate Minster, An IHG Hotel',
    location: 'Mumbai, Maharashtra',
    price: 79,
    rating: 3.9,
    reviews: 188,
    beds: 7,
    baths: 4,
    area: 100,
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
    network: '4 Network',
    category: 'Family',
    isFavorited: true,
  },
];

export default function PropertyGrid({ title = "Featured Properties", subtitle = "Discover our handpicked selection of premium properties." }: PropertyGridProps) {
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['3', '6', '8']));

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIconSolid className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
          </div>
          <Link
            href="/properties"
            className="text-brand-primary dark:text-brand-primary hover:text-primary-600 dark:hover:text-primary-300 font-medium flex items-center"
          >
            View all
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* City Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`pb-4 font-medium text-sm transition-colors relative ${
                selectedCity === city.id
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {city.name}
              {selectedCity === city.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative">
                <Image
                  src={property.image}
                  alt={property.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Hot Badge */}
                {property.isHot && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    10% today
                  </div>
                )}

                {/* Network and Category Badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-700 font-medium">
                    📊 {property.network}
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-700 font-medium">
                    👨‍👩‍👧‍👦 {property.category}
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                >
                  {favorites.has(property.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {property.title}
                </h3>

                {/* Property Details */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                  <span>🛏️ {property.beds} beds</span>
                  <span>🚿 {property.baths} baths</span>
                  <span>📐 {property.area} sq ft</span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(property.rating)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white mr-1">
                    {property.rating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({property.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{(property.price * 1000).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}