'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { BrandButton } from '@/components/ui/BrandButton';
import { BanknoteIcon, BuildingIcon, ChevronDown, MagnifyIcon } from '../ui/icon';
import {
  categoryDisplayNames,
  priceRanges,
  projectCategories,
  projectStatuses,
  statusDisplayNames,
} from '@/lib/project-search-config';

type SearchFilters = {
  category: string;
  status: string;
  priceRange: {
    min: number;
    max: number;
  };
};

type ProjectSearchBarProps = {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
  compact?: boolean;
};

type DropdownOption = { value: string; label: string };
type ProjectSuggestion = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  city: string | null;
  state: string | null;
  featuredImage: string;
  category: string;
  status: string;
  developerName: string | null;
};

const categoryOptions: DropdownOption[] = projectCategories.map((c) => ({
  value: c,
  label: categoryDisplayNames[c] || c,
}));

const statusOptions: DropdownOption[] = projectStatuses.map((s) => ({
  value: s,
  label: statusDisplayNames[s] || s,
}));

const budgetOptions: DropdownOption[] = priceRanges.map((r) => ({
  value: r.label,
  label: r.label,
}));

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function CustomDropdown({
  options,
  value,
  onChange,
  icon,
  compact,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={
          compact
            ? 'relative w-full flex items-center pl-8 pr-8 h-8 border border-gray-200 rounded bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FBB70F]'
            : 'relative h-10 w-full flex items-center pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#FBB70F] focus:outline-none bg-gray-50 text-gray-900 transition-all duration-200'
        }
      >
        <span
          className={
            compact
              ? 'absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none'
              : 'absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none'
          }
        >
          {icon}
        </span>
        <span className="flex-1 truncate text-left">{selectedLabel}</span>
        <ChevronDown
          className={
            compact
              ? 'absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none'
              : 'absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 pointer-events-none'
          }
        />
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 min-w-full bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#FBB70F]/10 transition-colors whitespace-nowrap ${
                  value === opt.value ? 'font-semibold text-[#112D48]' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProjectSearchBar({ onSearch, className = '', compact = false }: ProjectSearchBarProps) {
  const router = useRouter();
  const [projectCategory, setProjectCategory] = useState('All Categories');
  const [projectStatus, setProjectStatus] = useState('All Status');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const suggestionLimit = 50;

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
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (projectCategory !== 'All Categories') params.set('category', projectCategory);
    if (projectStatus !== 'All Status') params.set('status', projectStatus);
    if (selectedPriceRange.min > 0) params.set('minPrice', String(selectedPriceRange.min));
    if (selectedPriceRange.max > 0) params.set('maxPrice', String(selectedPriceRange.max));
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    if (compact) return;
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsFetching(true);
        const params = new URLSearchParams({
          page: '1',
          limit: String(suggestionLimit),
          search: searchQuery.trim(),
          category: 'ALL',
          status: 'ALL',
        });
        const res = await fetch(`/api/projects?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        setSuggestions(items);
        setShowSuggestions(true);
      } catch (error: unknown) {
        const isAbort = error instanceof DOMException && error.name === 'AbortError';
        if (!isAbort) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } finally {
        setIsFetching(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [compact, searchQuery]);

  useEffect(() => {
    if (compact) return;
    const handleOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [compact]);

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div>
          <label className="text-xs font-medium text-black mb-1 block">Category</label>
          <CustomDropdown
            options={categoryOptions}
            value={projectCategory}
            onChange={setProjectCategory}
            icon={<BuildingIcon className="w-4 h-4 text-gray-400" />}
            compact
          />
        </div>

        <div>
          <label className="text-xs font-medium text-black mb-1 block">Status</label>
          <CustomDropdown
            options={statusOptions}
            value={projectStatus}
            onChange={setProjectStatus}
            icon={<InfoIcon className="w-4 h-4 text-gray-400" />}
            compact
          />
        </div>

        <div>
          <label className="text-xs font-medium text-black mb-1 block">Budget</label>
          <CustomDropdown
            options={budgetOptions}
            value={selectedPriceRange.label}
            onChange={(val) => {
              const chosen = priceRanges.find((r) => r.label === val);
              if (chosen) setSelectedPriceRange(chosen);
            }}
            icon={<BanknoteIcon className="w-4 h-4 text-gray-400" />}
            compact
          />
        </div>

        <BrandButton
          variant="primary"
          onClick={handleSearch}
          className="w-full rounded text-xs border-0"
          shimmerDuration="2s"
        >
          <MagnifyIcon className="w-3 h-3 mr-2 inline-block" />
          Search Projects
        </BrandButton>
      </div>
    );
  }

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded shadow p-3 sm:p-4 border border-white/30 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="space-y-1 sm:space-y-2">
          {/* <label className="text-xs font-semibold text-white">Category</label> */}
          <CustomDropdown
            options={categoryOptions}
            value={projectCategory}
            onChange={setProjectCategory}
            icon={<BuildingIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />}
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          {/* <label className="text-xs font-semibold text-white">Status</label> */}
          <CustomDropdown
            options={statusOptions}
            value={projectStatus}
            onChange={setProjectStatus}
            icon={<InfoIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />}
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          {/* <label className="text-xs font-semibold text-white">Budget</label> */}
          <CustomDropdown
            options={budgetOptions}
            value={selectedPriceRange.label}
            onChange={(val) => {
              const chosen = priceRanges.find((r) => r.label === val);
              if (chosen) setSelectedPriceRange(chosen);
            }}
            icon={<BanknoteIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />}
          />
        </div>
      </div>
      <div
        className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-3 items-start"
        ref={suggestionRef}
      >
        <div className="relative">
          {/* <label className="text-xs font-semibold text-white">Search</label>   */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Search by project name, location, or developer..."
            className="w-full h-10 px-3 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBB70F] bg-white text-sm"
          />
          {showSuggestions ? (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded shadow-xl overflow-hidden max-h-96 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setShowSuggestions(false);
                      router.push(`/projects/${item.slug}`);
                    }}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 truncate">{item.title}</span>
                      <span className="block text-xs text-gray-500 truncate">
                        {item.subtitle || item.developerName || item.city || item.state || ''}
                      </span>
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase">
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </button>
                ))
              ) : isFetching ? null : (
                <div className="px-3 py-3 text-sm text-gray-600">No projects found matching your search</div>
              )}
              {suggestions.length >= suggestionLimit ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    const params = new URLSearchParams();
                    if (searchQuery.trim()) params.set('search', searchQuery.trim());
                    router.push(`/projects${params.toString() ? `?${params.toString()}` : ''}`);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  View all results
                </button>
              ) : null}
              {isFetching ? <div className="px-3 py-2 text-xs text-gray-500">Searching...</div> : null}
            </div>
          ) : null}
        </div>
        <div className="flex sm:items-end">
          <BrandButton
            variant="primary"
            onClick={handleSearch}
            className="w-full rounded border-0 h-10 px-4 py-0 hover:scale-none"
            shimmerDuration="2s"
          >
            <MagnifyIcon className="w-5 h-5 mr-2 inline-block -mt-0.5" />
            Search
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
