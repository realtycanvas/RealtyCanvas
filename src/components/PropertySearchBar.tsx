'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BrandButton } from './ui/BrandButton';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface PropertySearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  type: 'buy' | 'rent';
  location: string;
  propertyType: string;
  priceRange: {
    min: number;
    max: number;
  };
}

const propertyTypes = [
  'Any Type',
  'Apartment',
  'House',
  'Duplex House',
  'Villa',
  'Townhouse',
  'Studio',
  'Commercial',
  'Land',
];

const priceRanges = [
  { label: 'Any Price', min: 0, max: 10000000 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
  { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
  { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000 },
  { label: '₹10Cr+', min: 100000000, max: 1000000000 },
];

export default function PropertySearchBar({ onSearch, className = '' }: PropertySearchBarProps) {
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('Any Type');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);

  const handleSearch = () => {
    const filters: SearchFilters = {
      type: searchType,
      location,
      propertyType,
      priceRange: {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max,
      },
    };
    onSearch?.(filters);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
      {/* Search Type Tabs */}
      <div className="flex mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
          {(['buy', 'rent'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                searchType === type
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Location Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location, city, or property name"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Property Type</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200">
              <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <span className="truncate">{propertyType}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                <div className="py-2">
                  {propertyTypes.map((type) => (
                    <Menu.Item key={type}>
                      {({ active }) => (
                        <button
                          onClick={() => setPropertyType(type)}
                          className={`${
                            active ? 'bg-primary-50 dark:bg-secondary-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          {type}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Price Range Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price Range</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <span className="truncate">{selectedPriceRange.label}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-2">
                  {priceRanges.map((range) => (
                    <Menu.Item key={range.label}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedPriceRange(range)}
                          className={`${
                            active ? 'bg-primary-50 dark:bg-secondary-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          {range.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Search Button */}
        <BrandButton
          onClick={handleSearch}
          variant="primary"
          size="md"
          className="rounded-2xl flex items-center justify-center"
        >
          <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
          Search
        </BrandButton>
      </div>
    </div>
  );
}