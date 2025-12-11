"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
import MobileProjectFilters from "@/components/MobileProjectFilters";

// Types
export type Project = {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    category: "COMMERCIAL" | "RESIDENTIAL" | "RETAIL_ONLY" | "MIXED_USE"; // Aligned with prisma schema if possible, or string
    status: "UNDER_CONSTRUCTION" | "READY" | "PLANNED";
    address: string;
    city?: string | null;
    state?: string | null;
    featuredImage: string;
    createdAt: string;
    basePrice?: string | null;
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

export type Pagination = {
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

// Inline list-mode card (kept for list view layout)
function InlineProjectCard({ project, viewMode }: { project: Project; viewMode: "grid" | "list" }) {
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
                    {project.basePrice && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Base Price: {project.basePrice}
                        </p>
                    )}
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

    const priceRanges = [
        { label: 'Any Price', min: 0, max: 0 },
        { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
        { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
        { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
        { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000 },
        { label: '₹10Cr+', min: 100000000, max: 1000000000 },
    ];

    const hasActiveFilters = filters.category !== "ALL" || filters.status !== "ALL" ||
        filters.city || filters.state ||
        filters.priceRange.min > 0 || filters.priceRange.max > 0;

    return (
        <div className=" mb-6 w-full">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Price Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budget
                    </label>
                    <select
                        value={`${filters.priceRange.min}-${filters.priceRange.max}`}
                        onChange={(e) => {
                            const [minStr, maxStr] = e.target.value.split('-');
                            const min = parseInt(minStr, 10);
                            const max = parseInt(maxStr, 10);
                            onFiltersChange({ ...filters, priceRange: { min, max } });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        {priceRanges.map(range => (
                            <option key={range.label} value={`${range.min}-${range.max}`}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

interface ProjectListingClientProps {
    initialProjects: Project[];
    initialPagination: Pagination;
}

export default function ProjectListingClient({ initialProjects, initialPagination }: ProjectListingClientProps) {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(false); // Initially false as we have data from SSR
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const abortRef = useRef<AbortController | null>(null);
    const [visibleCount, setVisibleCount] = useState(initialProjects.length); // Show all initially for SSR consistency

    // Initialize filters from URL
    const [filters, setFilters] = useState<Filters>(() => ({
        category: searchParams.get('category') || "ALL",
        status: searchParams.get('status') || "ALL",
        city: searchParams.get('city') || "",
        state: searchParams.get('state') || "",
        priceRange: {
            min: parseInt(searchParams.get('minPrice') || '0'),
            max: parseInt(searchParams.get('maxPrice') || '0')
        }
    }));

    // Debounced filters to prevent multiple rapid API calls
    const [debouncedFilters, setDebouncedFilters] = useState<Filters>(() => ({
        category: searchParams.get('category') || "ALL",
        status: searchParams.get('status') || "ALL",
        city: searchParams.get('city') || "",
        state: searchParams.get('state') || "",
        priceRange: {
            min: parseInt(searchParams.get('minPrice') || '0'),
            max: parseInt(searchParams.get('maxPrice') || '0')
        }
    }));

    // Initialize pagination
    const [pagination, setPagination] = useState<Pagination>(initialPagination);

    // Track if it's the initial mount to avoid double fetching if not needed
    const isFirstRender = useRef(true);

    // Fetch projects function
    const fetchProjects = useCallback(async () => {
        // If it's the first render and we have initial projects that match the URL params (naive check), we might skip.
        // However, simplest is to just allow fetching if filters change or page change.
        // For now, we'll let it fetch if triggered, but we guard initial effect below.

        setLoading(true);
        setError(null);

        try {
            if (abortRef.current) {
                abortRef.current.abort('superseded-by-new-request');
            }
            const controller = new AbortController();
            abortRef.current = controller;

            const params = new URLSearchParams();
            params.set("page", pagination.page.toString());
            params.set("limit", "6");

            if (debouncedSearchQuery.trim()) {
                params.set("search", debouncedSearchQuery.trim());
            }

            if (debouncedFilters.category !== "ALL") {
                params.set("category", debouncedFilters.category);
            }

            if (debouncedFilters.status !== "ALL") {
                params.set("status", debouncedFilters.status);
            }

            if (debouncedFilters.city.trim()) {
                params.set("city", debouncedFilters.city.trim());
            }

            if (debouncedFilters.state.trim()) {
                params.set("state", debouncedFilters.state.trim());
            }

            if (debouncedFilters.priceRange.min > 0) {
                params.set("minPrice", debouncedFilters.priceRange.min.toString());
            }

            if (debouncedFilters.priceRange.max > 0) {
                params.set("maxPrice", debouncedFilters.priceRange.max.toString());
            }

            const response = await fetch(`/api/projects?${params.toString()}`, {
                cache: "default",
                signal: controller.signal
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

        } catch (err: any) {
            const isAbort = (
                err === 'superseded-by-new-request' ||
                err?.name === 'AbortError' ||
                err?.code === 'ABORT_ERR' ||
                err?.cause?.name === 'AbortError' ||
                (typeof err?.message === 'string' && (
                    err.message.toLowerCase().includes('abort') ||
                    err.message.toLowerCase().includes('superseded-by-new-request')
                ))
            );
            if (isAbort) return;
            console.error("Failed to fetch projects:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch projects");
            setProjects([]);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    }, [pagination.page, debouncedSearchQuery, debouncedFilters]);

    // Effects
    useEffect(() => {
        // Skip fetch on first render if we already have data from props
        // UNLESS the URL params differ from what would produce the initial data (e.g. user navigated with params that SSR didn't catch? Unlikely with correct SSR implementation)
        // For simplicity: if it's first render, we skip fetching because initialProjects is set.
        // We only fetch when dependencies change.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            // If we have no initial projects, try fetching immediately
            if (initialProjects.length === 0) {
                fetchProjects();
            }
            return;
        }
        fetchProjects();
    }, [fetchProjects]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== debouncedSearchQuery) {
                setDebouncedSearchQuery(searchQuery);
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, debouncedSearchQuery]);

    // Debounce filters
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedFilters(prev => {
                const changed =
                    prev.category !== filters.category ||
                    prev.status !== filters.status ||
                    prev.city !== filters.city ||
                    prev.state !== filters.state ||
                    prev.priceRange.min !== filters.priceRange.min ||
                    prev.priceRange.max !== filters.priceRange.max;
                return changed ? { ...filters } : prev;
            });
        }, 500);
        return () => clearTimeout(t);
    }, [filters]);

    useEffect(() => {
        if (searchQuery.trim() !== debouncedSearchQuery.trim()) {
            setSearchLoading(true);
        } else {
            setSearchLoading(false);
        }
    }, [searchQuery, debouncedSearchQuery]);

    // Update URL - Interactive filtering only
    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        if (pagination.page > 1) params.set('page', pagination.page.toString());
        if (debouncedFilters.category !== "ALL") params.set('category', debouncedFilters.category);
        if (debouncedFilters.status !== "ALL") params.set('status', debouncedFilters.status);
        if (debouncedFilters.city) params.set('city', debouncedFilters.city);
        if (debouncedFilters.state) params.set('state', debouncedFilters.state);
        if (debouncedFilters.priceRange.min > 0) params.set('minPrice', debouncedFilters.priceRange.min.toString());
        if (debouncedFilters.priceRange.max > 0) params.set('maxPrice', debouncedFilters.priceRange.max.toString());

        const newURL = params.toString() ? `/projects?${params.toString()}` : '/projects';
        router.push(newURL, { scroll: false });
    }, [pagination.page, debouncedFilters, router]);

    useEffect(() => {
        if (!isFirstRender.current) {
            updateURL();
        }
    }, [debouncedFilters, pagination.page, updateURL]);


    // Handlers
    const handleFiltersChange = useCallback((newFilters: Filters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({
            category: "ALL",
            status: "ALL",
            city: "",
            state: "",
            priceRange: { min: 0, max: 0 }
        });
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setSearchLoading(true);
        setDebouncedSearchQuery(searchQuery);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [searchQuery]);

    // Pagination Renderer
    const renderPagination = () => {
        const totalPages = Math.max(1, pagination.totalPages || 0);

        if (totalPages <= 1) {
            return (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button disabled className="p-2 rounded-md border border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed">
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <span className="text-sm">Page {Math.min(pagination.page, totalPages)} of {totalPages}</span>
                    <button disabled className="p-2 rounded-md border border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed">
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        const pages = [] as number[];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 w-full mt-[-10vw] lg:mt-0">

                    {/* Search */}
                    <div className="flex items-center gap-3 my-6 lg:my-2">
                        <form onSubmit={handleSearch} className="flex max-w-md ">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                {searchLoading && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </div>
                        </form>

                        <MobileProjectFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onClearFilters={handleClearFilters}
                            filteredCount={pagination.totalCount || projects.length}
                        />
                    </div>

                    <div className="hidden md:block w-full max-w-6xl mx-auto">
                        <ProjectFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>

                {/* Content */}
                {loading || authLoading ? (
                    <ProjectSkeleton viewMode={viewMode} />
                ) : searchLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Searching projects...</p>
                    </div>
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
                                    No projects found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
                            {projects.map((project) => (
                                <InlineProjectCard key={project.id} project={project} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
}
