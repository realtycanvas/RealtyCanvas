'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, BuildingOfficeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { BrandButton } from './ui/BrandButton';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ProjectSearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  compact?: boolean; // For sidebar usage
}

interface SearchFilters {
  category: string;
  status: string;
  priceRange: {
    min: number;
    max: number;
  };
}

const projectCategories = [
  'All Categories',
  'COMMERCIAL',
  'RESIDENTIAL', 

];

const projectStatuses = [
  'All Status',

  'UNDER_CONSTRUCTION',
  'READY',
];

const categoryDisplayNames: { [key: string]: string } = {
  'All Categories': 'All Categories',
  'COMMERCIAL': 'Commercial',
  'RESIDENTIAL': 'Residential',
};

const statusDisplayNames: { [key: string]: string } = {
  'All Status': 'All Status',

  'UNDER_CONSTRUCTION': 'Under Construction',
  'READY': 'Ready',
};

const priceRanges = [
  { label: 'Any Price', min: 0, max: 100000000 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹5Cr', min: 10000000, max: 50000000 },
  { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000 },
  { label: '₹10Cr - ₹25Cr', min: 100000000, max: 250000000 },
  { label: '₹25Cr+', min: 250000000, max: 1000000000 },
];

export default function ProjectSearchBar({ onSearch, className = '', compact = false }: ProjectSearchBarProps) {
  const [projectCategory, setProjectCategory] = useState('All Categories');
  const [projectStatus, setProjectStatus] = useState('All Status');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);

  const handleSearch = () => {
    const filters: SearchFilters = {
      category: projectCategory,
      status: projectStatus,
      priceRange: {
        min: selectedPriceRange.min,
        max: selectedPriceRange.max,
      },
    };
    onSearch?.(filters);
  };

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>

        {/* Project Category Dropdown */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 pr-2 h-8 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-xs">
              <BuildingOfficeIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <span className="truncate">{categoryDisplayNames[projectCategory] || projectCategory}</span>
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-background shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-input">
                {projectCategories.map((category) => (
                  <Menu.Item key={category}>
                    {({ active }) => (
                      <button
                        onClick={() => setProjectCategory(category)}
                        className={`${
                          active ? 'bg-accent' : ''
                        } block w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors duration-150`}
                      >
                        {categoryDisplayNames[category] || category}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Project Status Dropdown */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 pr-2 h-8 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-xs">
              <BuildingOfficeIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <span className="truncate">{statusDisplayNames[projectStatus] || projectStatus}</span>
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-background shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-input">
                {projectStatuses.map((status) => (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <button
                        onClick={() => setProjectStatus(status)}
                        className={`${
                          active ? 'bg-accent' : ''
                        } block w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors duration-150`}
                      >
                        {statusDisplayNames[status] || status}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Price Range Dropdown */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 pr-2 h-8 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-xs">
              <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-background shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-input">
                {priceRanges.map((range) => (
                  <Menu.Item key={range.label}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedPriceRange(range)}
                        className={`${
                          active ? 'bg-accent' : ''
                        } block w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors duration-150`}
                      >
                        {range.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full h-8 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium"
        >
          <MagnifyingGlassIcon className="w-4 h-4 mr-2 inline" />
          Search Projects
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-white/30 dark:border-gray-700/30 ${className}`}>
      {/* Search Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 items-end">

        {/* Project Category Dropdown */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-semibold text-white">Category</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200">
              <BuildingOfficeIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <span className="truncate">{categoryDisplayNames[projectCategory] || projectCategory}</span>
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-lg sm:rounded-2xl py-1 text-xs sm:text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200 dark:border-gray-600">
                {projectCategories.map((category) => (
                  <Menu.Item key={category}>
                    {({ active }) => (
                      <button
                        onClick={() => setProjectCategory(category)}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150`}
                      >
                        {categoryDisplayNames[category] || category}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Project Status Dropdown */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-semibold text-white">Status</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200">
              <BuildingOfficeIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <span className="truncate">{statusDisplayNames[projectStatus] || projectStatus}</span>
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-lg sm:rounded-2xl py-1 text-xs sm:text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200 dark:border-gray-600">
                {projectStatuses.map((status) => (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <button
                        onClick={() => setProjectStatus(status)}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150`}
                      >
                        {statusDisplayNames[status] || status}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Price Range Dropdown */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs font-semibold text-white">Budget</label>
          <Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200">
              <CurrencyDollarIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <span className="truncate">{selectedPriceRange.label}</span>
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <Menu.Items className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-lg sm:rounded-2xl py-1 text-xs sm:text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none border border-gray-200 dark:border-gray-600">
                {priceRanges.map((range) => (
                  <Menu.Item key={range.label}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedPriceRange(range)}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150`}
                      >
                        {range.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-3 sm:mt-4 flex justify-center">
        <BrandButton
          onClick={handleSearch}
          variant="primary"
          size="lg"
          className="rounded-xl sm:rounded-2xl px-4 sm:px-8 py-2 sm:py-3 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
        >
          <MagnifyingGlassIcon className="w-4 sm:w-6 h-4 sm:h-6 mr-2 sm:mr-3" />
          Search Projects
        </BrandButton>
      </div>
    </div>
  );
}