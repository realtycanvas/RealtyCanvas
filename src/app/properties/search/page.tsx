'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import PropertyFilterSidebar from '@/components/PropertyFilterSidebar';
import PropertyListingCard from '@/components/PropertyListingCard';

type Property = {
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
  description: string;
  createdAt: string;
  // Investment-related properties
  potentialCashflow: number;
  potentialYield: number;
  potentialValue: number;
};

// Component that uses searchParams
function PropertySearchContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchParams = useSearchParams();

  // Fetch properties from API
  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format data to include potential investment details and convert to INR
        const formattedData = (data || []).map((property: any) => ({
          ...property,
          currency: 'INR', // Set currency to INR for India
          potentialCashflow: Math.floor(property.price * 0.048), // 4.8% annual yield
          potentialYield: 8.5 + Math.random() * 3, // Random yield between 8.5-11.5%
          potentialValue: property.price * (1.2 + Math.random() * 0.8), // 20-100% potential growth
        }));

        setProperties(formattedData);
        setFilteredProperties(formattedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to empty array instead of mock data
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Apply URL search parameters on load
  useEffect(() => {
    if (properties.length === 0) return;

    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filtered = [...properties];

    if (location && location.trim()) {
      filtered = filtered.filter(property => 
        property.location?.toLowerCase().includes(location.toLowerCase()) ||
        property.address?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(maxPrice));
    }

    setFilteredProperties(filtered);
  }, [properties, searchParams]);

  const handleFiltersChange = (filters: any) => {
    // Apply filters to properties
    const filtered = properties.filter(property => {
      // Budget range filter
      if (property.price < filters.budgetRange.min || property.price > filters.budgetRange.max) {
        return false;
      }
      
      // Bedroom filter
      if (filters.bedrooms !== 'Any') {
        const minBeds = parseInt(filters.bedrooms.replace('+', ''));
        if (property.beds < minBeds) {
          return false;
        }
      }
      
      // Bathroom filter
      if (filters.bathrooms !== 'Any') {
        const minBaths = parseInt(filters.bathrooms.replace('+', ''));
        if (property.baths < minBaths) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
  };

  const handleClearFilters = () => {
    setFilteredProperties(properties);
  };

  const handleSaveSearch = () => {
    // Implement save search functionality
    alert('Search saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Fixed and Static */}
        {sidebarOpen && (
          <div className="w-80 flex-shrink-0">
            <PropertyFilterSidebar
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onSaveSearch={handleSaveSearch}
            />
          </div>
        )}

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '00' : filteredProperties.length.toString().padStart(2, '0')} Property search results
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {loading ? 'Loading properties...' : `Found ${filteredProperties.length} properties matching your criteria`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ViewColumnsIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    showMap
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Map View
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Property Listings - Scrollable */}
            <div className={`${showMap ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
              {loading ? (
                // Loading skeleton - Single column layout
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700">
                      <div className="flex">
                        <div className="w-1/3 h-48 bg-gray-300 dark:bg-gray-700"></div>
                        <div className="w-2/3 p-6">
                          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-3"></div>
                          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                          <div className="flex space-x-4 mb-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                          </div>
                          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No properties found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to find more properties.</p>
                </div>
              ) : (
                // Single column layout for property cards
                <div className="space-y-6">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                      <div className="flex">
                        {/* Image Section */}
                        <div className="w-1/3 relative">
                          <img
                            src={property.featuredImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Price Badge */}
                          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold text-lg">
                            ₹{(property.price / 100000).toFixed(1)}L
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="w-2/3 p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {property.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{property.address}</p>
                          
                          {/* Property Details */}
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 space-x-4">
                            <span>{property.beds} beds</span>
                            <span>{property.baths} baths</span>
                            <span>{property.area} m²</span>
                          </div>
                          
                          {/* Investment Details */}
                          {property.potentialCashflow && (
                            <div className="flex space-x-6 mb-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Cashflow:</span>
                                <span className="font-semibold text-gray-900 dark:text-white ml-1">
                                  ₹{property.potentialCashflow.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Yield:</span>
                                <span className="font-semibold text-gray-900 dark:text-white ml-1">
                                  {property.potentialYield?.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* View Details Button */}
                          <a
                            href={`/properties/${property.id}`}
                            className="inline-block bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl no-underline hover:no-underline focus:no-underline"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map View */}
            {showMap && (
              <div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-600">
                      <MapIcon className="w-16 h-16 text-brand-primary dark:text-brand-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Map integration coming soon
                      </p>
                      <div className="text-xs text-gray-400">
                        {filteredProperties.length} properties in this area
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Map Markers - Dynamic positioning based on actual properties */}
                {filteredProperties.slice(0, 4).map((property, index) => {
                  const positions = [
                    { top: '20%', left: '20%' },
                    { top: '40%', right: '25%' },
                    { bottom: '35%', left: '30%' },
                    { bottom: '20%', right: '20%' }
                  ];
                  
                  return (
                    <div 
                      key={property.id}
                      className="absolute bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-semibold cursor-pointer hover:bg-brand-primary transition-colors"
                      style={positions[index]}
                      title={property.title}
                    >
                      ₹{(property.price / 100000).toFixed(1)}L
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the PropertySearchContent component with Suspense
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
        </div>
      </div>
    }>
      <PropertySearchContent />
    </Suspense>
  );
}