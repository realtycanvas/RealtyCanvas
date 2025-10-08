"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import LazyImage from "@/components/ui/LazyImage";

// Types
type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: "COMMERCIAL" | "RESIDENTIAL";
  status: "UNDER_CONSTRUCTION" | "READY";
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  createdAt: string;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
  developerName?: string | null;
  locality?: string | null;
};

type Filters = {
  category: string;
  status: string;
  city: string;
  state: string;
  priceRange: { min: number; max: number };
};

type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
};

// Loading skeleton component
function ProjectSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <div className={`animate-pulse ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${viewMode === "grid" ? "h-80" : "h-32"}`} />
      ))}
    </div>
  );
}

// Project card component
function ProjectCard({ project, viewMode }: { project: Project; viewMode: "grid" | "list" }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "COMMERCIAL": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      // case "RETAIL_ONLY": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      // case "MIXED_USE": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "RESIDENTIAL": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      // case "PLANNED": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "UNDER_CONSTRUCTION": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "READY": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (viewMode === "list") {
    return (
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
          <div className="flex">
            <div className="w-48 h-32 flex-shrink-0">
              <LazyImage
                src={project.featuredImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex gap-2 ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(project.category)}`}>
                    {project.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {project.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                  {project.subtitle}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                📍 {project.address}
              </p>
              {(project.minRatePsf || project.maxRatePsf) && (
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ₹{project.minRatePsf || 'N/A'} - ₹{project.maxRatePsf || 'N/A'} per sq ft
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <LazyImage
            src={project.featuredImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(project.category)}`}>
              {project.category.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {project.subtitle}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            📍 {project.address}
          </p>
          {(project.minRatePsf || project.maxRatePsf) && (
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              ₹{project.minRatePsf || 'N/A'} - ₹{project.maxRatePsf || 'N/A'} per sq ft
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Filter component
function ProjectFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}) {
  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "COMMERCIAL", label: "Commercial" },
    // { value: "RETAIL_ONLY", label: "Retail Only" },
    // { value: "MIXED_USE", label: "Mixed Use" },
    { value: "RESIDENTIAL", label: "Residential" }
  ];

  const statuses = [
    { value: "ALL", label: "All Status" },
    // { value: "PLANNED", label: "Planned" },
    { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
    { value: "READY", label: "Ready" }
  ];

  const hasActiveFilters = filters.category !== "ALL" || filters.status !== "ALL" ||
    filters.city || filters.state ||
    filters.priceRange.min > 0 || filters.priceRange.max < 10000000;

  return (
    <div className=" mb-6 lg:w-[60%] w-full">
      <div className="flex items-center justify-between mb-4 ">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
            placeholder="Enter city"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div> */}

        {/* State Filter */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            value={filters.state}
            onChange={(e) => onFiltersChange({ ...filters, state: e.target.value })}
            placeholder="Enter state"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div> */}
      </div>
    </div>
  );
}

// Main Projects Page Component
export default function ProjectsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize filters from URL
  const [filters, setFilters] = useState<Filters>(() => ({
    category: searchParams.get('category') || "ALL",
    status: searchParams.get('status') || "ALL",
    city: searchParams.get('city') || "",
    state: searchParams.get('state') || "",
    priceRange: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '10000000')
    }
  }));

  // Initialize pagination
  const [pagination, setPagination] = useState<Pagination>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 6,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
    hasPrevious: false
  });

  // Fetch projects function
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", "6");

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      if (filters.category !== "ALL") {
        params.set("category", filters.category);
      }

      if (filters.status !== "ALL") {
        params.set("status", filters.status);
      }

      if (filters.city.trim()) {
        params.set("city", filters.city.trim());
      }

      if (filters.state.trim()) {
        params.set("state", filters.state.trim());
      }

      if (filters.priceRange.min > 0) {
        params.set("minPrice", filters.priceRange.min.toString());
      }

      if (filters.priceRange.max < 10000000) {
        params.set("maxPrice", filters.priceRange.max.toString());
      }

      const response = await fetch(`/api/projects?${params.toString()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProjects(data.projects || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 6,
        totalCount: 0,
        totalPages: 0,
        hasMore: false,
        hasPrevious: false
      });

    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, searchQuery, filters]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (pagination.page > 1) {
      params.set('page', pagination.page.toString());
    }

    if (filters.category !== "ALL") {
      params.set('category', filters.category);
    }

    if (filters.status !== "ALL") {
      params.set('status', filters.status);
    }

    if (filters.city) {
      params.set('city', filters.city);
    }

    if (filters.state) {
      params.set('state', filters.state);
    }

    if (filters.priceRange.min > 0) {
      params.set('minPrice', filters.priceRange.min.toString());
    }

    if (filters.priceRange.max < 10000000) {
      params.set('maxPrice', filters.priceRange.max.toString());
    }

    const newURL = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.push(newURL, { scroll: false });
  }, [pagination.page, filters, router]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      category: "ALL",
      status: "ALL",
      city: "",
      state: "",
      priceRange: { min: 0, max: 10000000 }
    });
    setSearchQuery("");
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProjects();
  }, [fetchProjects]);

  // Effects
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Render pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevious}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${page === pagination.page
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasMore}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between  flex-row-reverse   w-full">

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-[-44px]">
            <form onSubmit={handleSearch} className="flex max-w-md ">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>


          {isAdmin && (
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Project
            </Link>
          )}




          {/* Filters */}
          <ProjectFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>





        {/* Content */}
        {loading || authLoading ? (
          <ProjectSkeleton viewMode={viewMode} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-medium">Error loading projects</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            {isAdmin ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first project to get started.
                </p>
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create First Project
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Exciting new projects are being developed. Check back soon!
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Projects Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-2"}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} />
              ))}
            </div>


            {/* Results Info */}
            <div className="flex justify-between items-center">
              {!loading && (
                <div className="flex items-center justify-between ">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pagination.totalCount > 0 ? (
                      <>
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                        {pagination.totalCount} projects
                      </>
                    ) : (
                      "No projects found"
                    )}
                  </p>
                </div>
              )}
              {/* Pagination */}
              {renderPagination()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
