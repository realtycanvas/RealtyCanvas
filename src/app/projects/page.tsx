"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import ProjectSearchBar from "@/components/ProjectSearchBar";
import ProjectFilterSidebar from "@/components/ProjectFilterSidebar";
import MobileProjectFilters from "@/components/MobileProjectFilters";
import UnderMaintenanceLottie from "@/components/UnderMaintenanceLottie";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: "COMMERCIAL" | "RETAIL_ONLY" | "MIXED_USE" | "RESIDENTIAL";
  status: "PLANNED" | "UNDER_CONSTRUCTION" | "READY";
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  createdAt: string;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
};

// Component that uses sidebar context for toast notifications
function ProjectsContent() {
  const { isAdmin } = useAuth();
  const { open, setOpen } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState(() => {
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const cityParam = searchParams.get('city');
    const stateParam = searchParams.get('state');
    
    return {
      category: categoryParam && categoryParam !== 'All Categories' ? categoryParam : "ALL",
      status: statusParam && statusParam !== 'All Status' ? statusParam : "ALL",
      city: cityParam || "",
      state: stateParam || "",
      priceRange: { 
        min: minPriceParam ? parseInt(minPriceParam, 10) : 0, 
        max: maxPriceParam ? parseInt(maxPriceParam, 10) : 10000000 
      },
    };
   });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Initialize currentPage from URL parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
    hasPrevious: false,
  });
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasConnectionError, setHasConnectionError] = useState(false);

  // Function to update page and URL
  const updatePage = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/projects?${params.toString()}`, { scroll: false });
  };

  // Toast notification helper
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  // Sync currentPage with URL parameters
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const urlPage = pageParam ? parseInt(pageParam, 10) : 1;
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  // Sync filters with URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const cityParam = searchParams.get('city');
    const stateParam = searchParams.get('state');
    
    const urlFilters = {
      category: categoryParam && categoryParam !== 'All Categories' ? categoryParam : "ALL",
      status: statusParam && statusParam !== 'All Status' ? statusParam : "ALL",
      city: cityParam || "",
      state: stateParam || "",
      priceRange: { 
        min: minPriceParam ? parseInt(minPriceParam, 10) : 0, 
        max: maxPriceParam ? parseInt(maxPriceParam, 10) : 10000000 
      },
    };
    
    // Only update if filters have actually changed
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  // Handle sidebar state changes with toast notifications
  useEffect(() => {
    if (open) {
      showToast("Filters panel opened");
    } else {
      showToast("Filters panel closed");
    }
  }, [open]);

  // Load projects only when needed (for ISR optimization)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("limit", "6");
        
        // Add search query if present
        if (searchQuery && searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const res = await fetch(`/api/projects?${params.toString()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched projects:", data);
        
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
          setPagination(data.pagination);
          setHasConnectionError(false); // Reset connection error on successful fetch
        } else {
          console.error("API did not return expected format:", data);
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
        setFilteredProjects([]);
        // Check if it's a connection error
        if (
          error instanceof Error &&
          (error.message.includes("fetch") ||
            error.message.includes("network") ||
            error.message.includes("connection"))
        ) {
          setHasConnectionError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, searchQuery]);

  // Fetch filtered projects from database when filters change
  useEffect(() => {
    const fetchFilteredProjects = async () => {
      // Skip if search is active (search is handled by main fetchProjects)
      if (searchQuery && searchQuery.trim()) return;

      // Check if any filters are active
      const hasActiveFilters =
        filters.category !== "ALL" ||
        filters.status !== "ALL" ||
        filters.city ||
        filters.state ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 10000000;

      // If no filters are active, let the main fetchProjects handle it
      if (!hasActiveFilters) {
        return;
      }

      try {
        setLoading(true);

        // Build query parameters for filters
        const params = new URLSearchParams();
        params.set("page", currentPage.toString());
        params.set("limit", "6");

        if (filters.category !== "ALL") {
          params.set("category", filters.category);
        }
        if (filters.status !== "ALL") {
          params.set("status", filters.status);
        }
        if (filters.city) {
          params.set("city", filters.city);
        }
        if (filters.state) {
          params.set("state", filters.state);
        }
        if (filters.priceRange.min > 0) {
          params.set("minPrice", filters.priceRange.min.toString());
        }
        if (filters.priceRange.max < 10000000) {
          params.set("maxPrice", filters.priceRange.max.toString());
        }

        const res = await fetch(`/api/projects?${params.toString()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Filtered projects from DB:", data);

        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
          setPagination(data.pagination);
          setHasConnectionError(false); // Reset connection error on successful fetch
        } else {
          console.error("API did not return expected format:", data);
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch filtered projects:", error);
        setProjects([]);
        setFilteredProjects([]);
        // Check if it's a connection error
        if (
          error instanceof Error &&
          (error.message.includes("fetch") ||
            error.message.includes("network") ||
            error.message.includes("connection"))
        ) {
          setHasConnectionError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProjects();
  }, [filters, currentPage]); // Removed searchQuery from dependencies

  // Simple client-side filtering for search results (keeps search fast)
  useEffect(() => {
    // This effect is no longer needed since search is handled server-side
    // Keeping it empty to avoid breaking existing functionality
  }, [projects, searchQuery]);

  // Add a refresh button function
  const refreshProjects = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/projects?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Refreshed projects:", data);

      if (Array.isArray(data)) {
        setProjects(data);
        setFilteredProjects(data); // Reset filtered projects to all projects
        showToast("Projects refreshed successfully");
      } else {
        console.error("API did not return an array:", data);
        setProjects([]);
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error("Failed to refresh projects:", error);
      showToast("Failed to refresh projects");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input with dropdown results
  const handleSearchInput = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setShowSearchDropdown(false);
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setShowSearchDropdown(true);

    try {
      // Build search URL with query parameters
      const searchParams = new URLSearchParams({
        page: "1",
        limit: "10", // Limit for dropdown results
        search: query.trim(), // Ensure we trim the query
      });

      const res = await fetch(`/api/projects?${searchParams.toString()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(`Search results for "${query}":`, data); // Debug log

      if (data.projects && Array.isArray(data.projects)) {
        setSearchResults(data.projects);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to search projects:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle clicking on search result
  const handleSearchResultClick = (
    projectSlug: string,
    projectTitle: string
  ) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    window.location.href = `/projects/${projectSlug}`;
  };

  // Handle search query changes
  const handleSearch = (filters: any) => {
    if (typeof filters === "string") {
      handleSearchInput(filters);
    } else {
      // Handle SearchFilters object
      setSearchQuery("");
      setFilters({
        category:
          filters.category === "All Categories" ? "ALL" : filters.category,
        status: filters.status === "All Status" ? "ALL" : filters.status,
        city: filters.location || "",
        state: "",
        priceRange: filters.priceRange || { min: 0, max: 10000000 },
      });
    }
  };

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    
    // Update URL parameters to reflect filter changes
    const params = new URLSearchParams(searchParams.toString());
    
    // Update category parameter
    if (newFilters.category && newFilters.category !== "ALL") {
      params.set('category', newFilters.category);
    } else {
      params.delete('category');
    }
    
    // Update status parameter
    if (newFilters.status && newFilters.status !== "ALL") {
      params.set('status', newFilters.status);
    } else {
      params.delete('status');
    }
    
    // Update city parameter
    if (newFilters.city) {
      params.set('city', newFilters.city);
    } else {
      params.delete('city');
    }
    
    // Update state parameter
    if (newFilters.state) {
      params.set('state', newFilters.state);
    } else {
      params.delete('state');
    }
    
    // Update price range parameters
    if (newFilters.priceRange.min > 0) {
      params.set('minPrice', newFilters.priceRange.min.toString());
    } else {
      params.delete('minPrice');
    }
    
    if (newFilters.priceRange.max < 10000000) {
      params.set('maxPrice', newFilters.priceRange.max.toString());
    } else {
      params.delete('maxPrice');
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    setCurrentPage(1);
    
    // Update the URL
    router.push(`/projects?${params.toString()}`, { scroll: false });
  }, [searchParams, router, setFilters, setCurrentPage]);

  // Handle clearing filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      category: "ALL",
      status: "ALL",
      city: "",
      state: "",
      priceRange: { min: 0, max: 10000000 },
    };
    
    setFilters(clearedFilters);
    setSearchQuery("");
    
    // Clear all filter parameters from URL
    const params = new URLSearchParams();
    params.set('page', '1');
    setCurrentPage(1);
    
    // Update the URL to show only page parameter
    router.push(`/projects?${params.toString()}`, { scroll: false });
  }, [router, setFilters, setSearchQuery, setCurrentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Project deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "COMMERCIAL":
        return "bg-blue-100 text-blue-800";
      case "RETAIL_ONLY":
        return "bg-green-100 text-green-800";
      case "MIXED_USE":
        return "bg-purple-100 text-purple-800";
      case "RESIDENTIAL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "bg-yellow-100 text-yellow-800";
      case "UNDER_CONSTRUCTION":
        return "bg-blue-100 text-blue-800";
      case "READY":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-16">
      <div className="flex w-full">
        {/* Left Sidebar - Filters */}
        <Sidebar variant="inset" className="h-[calc(100vh-4rem)] sticky top-16 hidden lg:block">
          <SidebarHeader>
            <div className="flex items-center justify-between gap-2 px-4 py-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              {/* <SidebarTrigger className="h-6 w-6" /> */}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupLabel>View Options</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 flex-1 text-xs"
                  >
                    <Squares2X2Icon className="h-3 w-3 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 flex-1 text-xs"
                  >
                    <ListBulletIcon className="h-3 w-3 mr-1" />
                    List
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup className="flex-1">
              <SidebarGroupContent className="space-y-4">
                <ProjectFilterSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="px-4 py-2 text-xs text-muted-foreground">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"} found
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen w-full lg:w-auto">
          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
              {toast}
            </div>
          )}

          {/* Header with Search */}
          <header className="sticky top-16 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 px-4">
              {/* <SidebarTrigger className="-ml-1" /> */}
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold hidden sm:block">Projects Dashboard</h1>
              <h1 className="text-lg font-semibold sm:hidden">Projects</h1>
            </div>

            {/* Search Bar in Header */}
            <div className="ml-auto flex items-center gap-2 px-4">
              {/* Mobile Filter Button */}
              <MobileProjectFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                filteredCount={filteredProjects.length}
              />
              
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchDropdown(false), 200)
                  }
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                </div>

                {/* Search Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto overflow-x-hidden z-50">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((project) => (
                          <div
                            key={project.id}
                            onClick={() =>
                              handleSearchResultClick(
                                project.slug,
                                project.title
                              )
                            }
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={project.featuredImage}
                                alt={project.title}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 overflow-hidden">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {project.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {project.address}
                                </p>
                                <div className="flex items-center space-x-2 mt-1 overflow-hidden">
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                                    {project.category}
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                                    {project.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      searchQuery && (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">
                            No projects found for &quot;{searchQuery}&quot;
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {(searchQuery ||
                filters.category !== "ALL" ||
                filters.status !== "ALL" ||
                filters.city ||
                filters.state) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-2"
                >
                  <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Clear filters</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </header>

          {/* Main Content - Full Width */}
          <main className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-900 overflow-x-hidden">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg border shadow-sm animate-pulse"
                  >
                    <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
                  {hasConnectionError ? (
                    <>
                      <div className="flex justify-center mb-6">
                        <UnderMaintenanceLottie width={120} height={120} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Under Maintenance
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        We&apos;re experiencing some technical difficulties. Please
                        check back in a few minutes.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        🔄 Retry
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🏗️</span>
                      </div>
                      {isAdmin ? (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            No projects yet
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Create your first premium development project to
                            showcase your portfolio.
                          </p>
                          <Link
                            href="/projects/new"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            🚀 Create First Project
                          </Link>
                        </>
                      ) : (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Coming Soon
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Exciting new projects are being developed. Check
                            back soon to discover amazing opportunities!
                          </p>
                          <div className="inline-block px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl font-semibold">
                            🔔 Stay Tuned
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="mb-8">
                    <svg
                      className="mx-auto h-24 w-24 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    No matching projects found
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Try adjusting your search criteria or filters to find what
                    you&apos;re looking for.
                  </p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                        onClick={() =>
                          (window.location.href = `/projects/${project.slug}`)
                        }
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={project.featuredImage}
                            alt={project.title}
                            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2 flex-wrap">
                            <span
                              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(
                                project.category
                              )} border border-white/20`}
                            >
                              {project.category.replace("_", " ")}
                            </span>
                            <span
                              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(
                                project.status
                              )} border border-white/20`}
                            >
                              {project.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 md:p-8">
                          <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-yellow-500 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {project.title}
                          </h3>
                          {project.subtitle && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs leading-relaxed line-clamp-3">
                              {project.subtitle}
                            </p>
                          )}

                          <div className="flex items-start text-gray-600 dark:text-gray-400 mb-4">
                            <span className="mr-2 flex-shrink-0">📍</span>
                            <span className="text-xs line-clamp-2">
                              {project.address}
                              {project.city && `, ${project.city}`}
                              {project.state && `, ${project.state}`}
                            </span>
                          </div>

                          {(project.minRatePsf || project.maxRatePsf) && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 sm:p-4 mb-4">
                              <div className="text-green-700 dark:text-green-400 font-bold text-base sm:text-lg">
                                {project.minRatePsf || project.maxRatePsf}
                                {project.minRatePsf &&
                                project.maxRatePsf &&
                                project.minRatePsf !== project.maxRatePsf
                                  ? ` - ${project.maxRatePsf}`
                                  : ""}
                              </div>
                              <div className="text-green-600 dark:text-green-500 text-xs font-medium">
                                per sq ft
                              </div>
                            </div>
                          )}

                          {isAdmin && (
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {/* Created {new Date(project.createdAt).toLocaleDateString()} */}
                              </div>
                              <div
                                className="flex items-center gap-1 sm:gap-2 flex-wrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link
                                  href={`/projects/${project.slug}`}
                                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View
                                </Link>
                                <Link
                                  href={`/projects/new?edit=${project.slug}`}
                                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(project.id);
                                  }}
                                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                                  disabled={deletingId === project.id}
                                >
                                  {deletingId === project.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                        onClick={() =>
                          (window.location.href = `/projects/${project.slug}`)
                        }
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative overflow-hidden sm:w-80 sm:flex-shrink-0">
                            <img
                              src={project.featuredImage}
                              alt={project.title}
                              className="w-full h-48 sm:h-full sm:min-h-[200px] object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2 flex-wrap">
                              <span
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(
                                  project.category
                                )} border border-white/20`}
                              >
                                {project.category.replace("_", " ")}
                              </span>
                              <span
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(
                                  project.status
                                )} border border-white/20`}
                              >
                                {project.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-yellow-500 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {project.title}
                                </h3>
                                {project.subtitle && (
                                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs leading-relaxed line-clamp-3">
                                    {project.subtitle}
                                  </p>
                                )}

                                <div className="flex items-start text-gray-600 dark:text-gray-400 mb-4">
                                  <span className="mr-2 flex-shrink-0">📍</span>
                                  <span className="text-xs line-clamp-2">
                                    {project.address}
                                    {project.city && `, ${project.city}`}
                                    {project.state && `, ${project.state}`}
                                  </span>
                                </div>
                              </div>

                              {(project.minRatePsf || project.maxRatePsf) && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 sm:p-4 sm:min-w-[160px] flex-shrink-0">
                                  <div className="text-green-700 dark:text-green-400 font-bold text-base sm:text-lg">
                                    {project.minRatePsf || project.maxRatePsf}
                                    {project.minRatePsf &&
                                    project.maxRatePsf &&
                                    project.minRatePsf !== project.maxRatePsf
                                      ? ` - ${project.maxRatePsf}`
                                      : ""}
                                  </div>
                                  <div className="text-green-600 dark:text-green-500 text-xs font-medium">
                                    per sq ft
                                  </div>
                                </div>
                              )}
                            </div>

                            {isAdmin && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {/* Created {new Date(project.createdAt).toLocaleDateString()} */}
                                </div>
                                <div
                                  className="flex items-center gap-1 sm:gap-2 flex-wrap"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Link
                                    href={`/projects/${project.slug}`}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View
                                  </Link>
                                  <Link
                                    href={`/projects/new?edit=${project.slug}`}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(project.id);
                                    }}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                                    disabled={deletingId === project.id}
                                  >
                                    {deletingId === project.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination Controls */}
            {!loading && filteredProjects.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2 sm:px-4">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                  Showing page {pagination.page} of {pagination.totalPages} (
                  {pagination.totalCount} total projects)
                </div>
                <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                  <button
                    onClick={() =>
                      updatePage(Math.max(1, currentPage - 1))
                    }
                    disabled={!pagination.hasPrevious || loading}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .filter((pageNum) => {
                        const current = pagination.page;
                        return (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= current - 1 && pageNum <= current + 1)
                        );
                      })
                      .map((pageNum, index, array) => {
                        const prevPageNum = array[index - 1];
                        const showEllipsis =
                          prevPageNum && pageNum - prevPageNum > 1;

                        return (
                          <div
                            key={pageNum}
                            className="flex items-center gap-1"
                          >
                            {showEllipsis && (
                              <span className="px-1 sm:px-2 py-1 text-gray-500 text-xs sm:text-sm">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => updatePage(pageNum)}
                              disabled={loading}
                              className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                pageNum === pagination.page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {pageNum}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      updatePage(Math.min(pagination.totalPages, currentPage + 1))
                    }
                    disabled={!pagination.hasMore || loading}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps ProjectsContent with SidebarProvider
export default function ProjectsPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <ProjectsContent />
    </SidebarProvider>
  );
}
