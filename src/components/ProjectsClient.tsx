"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Squares2X2Icon, ListBulletIcon, XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProjectCard from "@/components/ProjectCard";

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
  createdAt: string | Date;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
  developerName?: string | null;
  locality?: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
};

type Filters = {
  category: string;
  status: string;
  city: string;
  state: string;
  priceRange: { min: number; max: number };
};

export default function ProjectsClient({ initialProjects, initialPagination }: { initialProjects: Project[]; initialPagination: Pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>(() => initialProjects);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [pagination, setPagination] = useState<Pagination>(() => initialPagination);

  const [filters, setFilters] = useState<Filters>(() => ({
    category: searchParams.get("category") || "ALL",
    status: searchParams.get("status") || "ALL",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    priceRange: {
      min: parseInt(searchParams.get("minPrice") || "0"),
      max: parseInt(searchParams.get("maxPrice") || "10000000"),
    },
  }));

  const hasActiveFilters = useMemo(
    () =>
      filters.category !== "ALL" ||
      filters.status !== "ALL" ||
      filters.city.trim() ||
      filters.state.trim() ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max < 10000000,
    [filters]
  );

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page.toString());
      params.set("limit", "6");

      if (debouncedSearchQuery.trim()) params.set("search", debouncedSearchQuery.trim());
      if (filters.category !== "ALL") params.set("category", filters.category);
      if (filters.status !== "ALL") params.set("status", filters.status);
      if (filters.city.trim()) params.set("city", filters.city.trim());
      if (filters.state.trim()) params.set("state", filters.state.trim());
      if (filters.priceRange.min > 0) params.set("minPrice", filters.priceRange.min.toString());
      if (filters.priceRange.max < 10000000) params.set("maxPrice", filters.priceRange.max.toString());

      const response = await fetch(`/api/projects?${params.toString()}`, {
        headers: { "Accept": "application/json" },
        cache: "no-store",
      });

      if (response.status === 304) {
        // Data unchanged; keep current state
        setLoading(false);
        setSearchLoading(false);
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setProjects(data.projects || []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 6,
          totalCount: 0,
          totalPages: 0,
          hasMore: false,
          hasPrevious: false,
        }
      );
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [pagination.page, debouncedSearchQuery, filters]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (pagination.page > 1) params.set("page", pagination.page.toString());
    if (filters.category !== "ALL") params.set("category", filters.category);
    if (filters.status !== "ALL") params.set("status", filters.status);
    if (filters.city) params.set("city", filters.city);
    if (filters.state) params.set("state", filters.state);
    if (filters.priceRange.min > 0) params.set("minPrice", filters.priceRange.min.toString());
    if (filters.priceRange.max < 10000000) params.set("maxPrice", filters.priceRange.max.toString());
    const newURL = params.toString() ? `/projects?${params.toString()}` : "/projects";
    router.push(newURL, { scroll: false });
  }, [pagination.page, filters, router]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ category: "ALL", status: "ALL", city: "", state: "", priceRange: { min: 0, max: 10000000 } });
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchLoading(true);
      setDebouncedSearchQuery(searchQuery);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [searchQuery]
  );

  useEffect(() => {
    // Only fetch if user changes filters/pagination beyond initial server data
    if (pagination.page !== 1 || hasActiveFilters || debouncedSearchQuery.trim()) {
      fetchProjects();
    }
  }, [fetchProjects, pagination.page, hasActiveFilters, debouncedSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== debouncedSearchQuery) {
        setDebouncedSearchQuery(searchQuery);
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    updateURL();
  }, [filters, pagination.page, updateURL]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore our curated selection of premium projects</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
            title="Grid View"
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
            title="List View"
          >
            <ListBulletIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, address, city..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5" />
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1">
              <XMarkIcon className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFiltersChange({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {[
                { value: "ALL", label: "All Categories" },
                { value: "COMMERCIAL", label: "Commercial" },
                { value: "RESIDENTIAL", label: "Residential" },
              ].map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFiltersChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {[
                { value: "ALL", label: "All Status" },
                { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
                { value: "READY", label: "Ready" },
              ].map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-medium">Error loading projects</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-2"}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          disabled={!pagination.hasPrevious}
          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
        <button
          disabled={!pagination.hasMore}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}