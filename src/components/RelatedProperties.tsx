'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  currency: string;
  featuredImage: string;
  beds: number;
  baths: number;
  area: number;
  location: string;
  score?: number;
}

interface RelatedPropertiesProps {
  currentPropertyId: string;
  currentPrice: number;
  currentLocation: string;
  limit?: number;
}

export default function RelatedProperties({ 
  currentPropertyId, 
  currentPrice, 
  currentLocation, 
  limit = 3 
}: RelatedPropertiesProps) {
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchRelatedProperties() {
      try {
        // Fetch properties with similar criteria
        const response = await fetch(`/api/properties?exclude=${currentPropertyId}&limit=${limit * 2}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related properties');
        }
        
        const data = await response.json();
        
        // Filter and sort properties by relevance
        const filtered = data
          .filter((property: Property) => property.id !== currentPropertyId)
          .map((property: Property) => {
            let score = 0;
            
            // Location match (highest priority)
            if (property.location?.toLowerCase().includes(currentLocation?.toLowerCase()) || 
                property.address?.toLowerCase().includes(currentLocation?.toLowerCase())) {
              score += 10;
            }
            
            // Price similarity (within 30% range)
            const priceDiff = Math.abs(property.price - currentPrice);
            const priceRange = currentPrice * 0.3;
            if (priceDiff <= priceRange) {
              score += 5;
            }
            
            // Add property with score
            return { ...property, score };
          })
          .sort((a: Property, b: Property) => (b.score ?? 0) - (a.score ?? 0))
          .slice(0, limit);
        
        setRelatedProperties(filtered);
      } catch (error) {
        console.error('Error fetching related properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProperties();
  }, [currentPropertyId, currentPrice, currentLocation, limit]);

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}k`;
    }
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Related Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="flex space-x-4 mb-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Related Properties</h2>
        <Link 
          href="/properties" 
          className="text-brand-primary dark:text-brand-primary hover:text-primary-600 dark:hover:text-primary-300 font-medium"
        >
          View All Properties →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProperties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            {/* Image */}
            <div className="relative">
              <Link href={`/properties/${property.id}`}>
                <Image
                  src={property.featuredImage}
                  alt={property.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Price Badge */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl font-bold text-sm">
                {formatPrice(property.price)}
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(property.id)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              >
                {favorites.has(property.id) ? (
                  <HeartIconSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title and Address */}
              <div className="mb-3">
                <Link href={`/properties/${property.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                    {property.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{property.address}</p>
              </div>

              {/* Property Details */}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 space-x-4">
                <span>{property.beds} beds</span>
                <span>{property.baths} baths</span>
                <span>{property.area} m²</span>
              </div>

              {/* View Details Button */}
              <Link
                href={`/properties/${property.id}`}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white text-center py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}