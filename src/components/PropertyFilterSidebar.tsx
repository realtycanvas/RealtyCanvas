'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FilterOptions {
  budgetRange: {
    min: number;
    max: number;
  };
  investmentObjective: string;
  bedrooms: string;
  bathrooms: string;
  carParks: string;
  landSize: {
    min: number;
    max: number;
  };
  state: string;
}

interface PropertyFilterSidebarProps {
  onFiltersChange?: (filters: FilterOptions) => void;
  onClearFilters?: () => void;
  onSaveSearch?: () => void;
}

export default function PropertyFilterSidebar({ 
  onFiltersChange, 
  onClearFilters, 
  onSaveSearch 
}: PropertyFilterSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    budgetRange: { min: 400000, max: 500000 },
    investmentObjective: 'Cash Flow',
    bedrooms: 'Any',
    bathrooms: '1+',
    carParks: '2+',
    landSize: { min: 100, max: 700 },
    state: 'All States',
  });

  const budgetRanges = [
    '40L - 50L',
    '50L - 70L',
    '70L - 1Cr',
    '1Cr - 2Cr',
    '2Cr+',
  ];

  const investmentObjectives = [
    'Cash Flow',
    'Capital Growth',
    'Balanced',
    'Development',
  ];

  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathroomOptions = ['Any', '1+', '2+', '3+', '4+'];
  const carParkOptions = ['Any', '1+', '2+', '3+', '4+'];

  const states = [
    'All States',
    'Maharashtra',
    'Delhi',
    'Karnataka',
    'Tamil Nadu',
    'Telangana',
    'Gujarat',
    'Uttar Pradesh',
    'West Bengal',
    'Rajasthan',
    'Andhra Pradesh',
    'Kerala',
    'Madhya Pradesh',
    'Punjab',
    'Haryana',
    'Bihar',
    'Odisha',
    'Assam',
    'Jharkhand',
    'Chhattisgarh',
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      budgetRange: { min: 0, max: 10000000 },
      investmentObjective: 'Any',
      bedrooms: 'Any',
      bathrooms: 'Any',
      carParks: 'Any',
      landSize: { min: 0, max: 1000 },
      state: 'All States',
    };
    setFilters(defaultFilters);
    onClearFilters?.();
  };

  // Convert budget range display to actual values
  const getBudgetRangeValue = (range: string) => {
    if (range.includes('Cr')) {
      const value = parseFloat(range.replace('Cr', '').replace('+', ''));
      return value * 10000000;
    } else if (range.includes('L')) {
      const value = parseFloat(range.replace('L', '').replace('+', ''));
      return value * 100000;
    }
    return 0;
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearFilters}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Clear filter
            </button>
            <button
              onClick={onSaveSearch}
              className="text-sm text-brand-primary dark:text-brand-primary hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
            >
              Save search
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Budget Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Budget range</h3>
            <select
              value={`${(filters.budgetRange.min / 100000).toFixed(0)}L - ${(filters.budgetRange.max / 100000).toFixed(0)}L`}
              onChange={(e) => {
                const range = e.target.value;
                const min = getBudgetRangeValue(range.split(' - ')[0]);
                const max = getBudgetRangeValue(range.split(' - ')[1]);
                handleFilterChange('budgetRange', { min, max });
              }}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {budgetRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Investment Objective */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Investment objective</h3>
            <select
              value={filters.investmentObjective}
              onChange={(e) => handleFilterChange('investmentObjective', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {investmentObjectives.map((objective) => (
                <option key={objective} value={objective}>{objective}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms, Bathrooms & Car Parks */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bedrooms, bathrooms & car parks</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {bedroomOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {bathroomOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Car Parks</label>
                <select
                  value={filters.carParks}
                  onChange={(e) => handleFilterChange('carParks', e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  {carParkOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Land Size */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Land size</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Min (m²)</label>
                <input
                  type="number"
                  value={filters.landSize.min}
                  onChange={(e) => handleFilterChange('landSize', { ...filters.landSize, min: parseInt(e.target.value) })}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Max (m²)</label>
                <input
                  type="number"
                  value={filters.landSize.max}
                  onChange={(e) => handleFilterChange('landSize', { ...filters.landSize, max: parseInt(e.target.value) })}
                  className="w-full p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="700"
                />
              </div>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">States</h3>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Pet Friendly</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Furnished</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Swimming Pool</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Garage</span>
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}