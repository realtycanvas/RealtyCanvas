'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ProjectSearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function ProjectSearchBar({ searchQuery, onSearch, className = '' }: ProjectSearchBarProps) {

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search projects..."
            className="w-full h-8 pl-8 pr-2 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-8 px-3 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
        >
          <MagnifyingGlassIcon className="w-3 h-3" />
          Search
        </button>
      </div>
    </div>
  );
}