'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FilterOptions {
  category: string;
  status: string;
  city: string;
  state: string;
  priceRange: {
    min: number;
    max: number;
  };
}

interface ProjectFilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function ProjectFilterSidebar({ 
  filters,
  onFiltersChange, 
  onClearFilters
}: ProjectFilterSidebarProps) {

  const categories = [
    'ALL',
    'COMMERCIAL',
    'RETAIL_ONLY',
    'MIXED_USE',
    'RESIDENTIAL'
  ];

  const statuses = [
    'ALL',
    'PLANNED',
    'UNDER_CONSTRUCTION',
    'READY'
  ];

  const priceRanges = [
    { label: 'Any Price', min: 0, max: 10000000 },
    { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
    { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
    { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
    { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000 },
    { label: '₹10Cr+', min: 100000000, max: 1000000000 },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {/* Category */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'ALL' ? 'All Categories' : category.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        {/* <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Enter city name"
            className="w-full h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div> */}

        {/* State */}
        {/* <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">State</label>
          <input
            type="text"
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            placeholder="Enter state name"
            className="w-full h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div> */}

        {/* Price Range */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price Range</label>
          <select
            value={priceRanges.findIndex(range => 
              range.min === filters.priceRange.min && range.max === filters.priceRange.max
            )}
            onChange={(e) => {
              const selectedRange = priceRanges[parseInt(e.target.value)];
              handleFilterChange('priceRange', selectedRange);
            }}
            className="w-full h-8 px-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {priceRanges.map((range, index) => (
              <option key={range.label} value={index}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}