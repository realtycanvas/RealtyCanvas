'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Squares2X2Icon, ListBulletIcon, XMarkIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ProjectSearchBar from '@/components/ProjectSearchBar';
import ProjectFilterSidebar from '@/components/ProjectFilterSidebar';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: 'COMMERCIAL' | 'RETAIL_ONLY' | 'MIXED_USE' | 'RESIDENTIAL';
  status: 'PLANNED' | 'UNDER_CONSTRUCTION' | 'READY';
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  createdAt: string;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
};

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'ALL',
    status: 'ALL',
    city: '',
    state: '',
    priceRange: { min: 0, max: 10000000 },
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', { 
          cache: 'force-cache',
          next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Projects API response:', data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProjects(data);
          setFilteredProjects(data);
        } else {
          console.error('API did not return an array:', data);
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Filter projects when search query or filters change
  useEffect(() => {
    if (!projects.length) return;
    
    let filtered = [...projects];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        (project.subtitle && project.subtitle.toLowerCase().includes(query)) ||
        project.address.toLowerCase().includes(query) ||
        (project.city && project.city.toLowerCase().includes(query)) ||
        (project.state && project.state.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(project => project.category === filters.category);
    }
    
    // Apply status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(project => project.status === filters.status);
    }
    
    // Apply city filter
    if (filters.city) {
      const cityQuery = filters.city.toLowerCase();
      filtered = filtered.filter(project => 
        project.city && project.city.toLowerCase().includes(cityQuery)
      );
    }
    
    // Apply state filter
    if (filters.state) {
      const stateQuery = filters.state.toLowerCase();
      filtered = filtered.filter(project => 
        project.state && project.state.toLowerCase().includes(stateQuery)
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(project => {
      // If min and max rate are not available, include the project
      if (!project.minRatePsf && !project.maxRatePsf) return true;
      
      // Convert string rates to numbers for comparison
      const minRate = project.minRatePsf ? parseFloat(project.minRatePsf.replace(/[^0-9.]/g, '')) : 0;
      const maxRate = project.maxRatePsf ? parseFloat(project.maxRatePsf.replace(/[^0-9.]/g, '')) : Infinity;
      
      // Check if project's price range overlaps with filter's price range
      return (
        (minRate >= filters.priceRange.min && minRate <= filters.priceRange.max) ||
        (maxRate >= filters.priceRange.min && maxRate <= filters.priceRange.max)
      );
    });
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, filters]);
  
  // Add a refresh button function
  const refreshProjects = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/projects?t=${timestamp}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Refreshed projects:', data);
      
      if (Array.isArray(data)) {
        setProjects(data);
        setFilteredProjects(data); // Reset filtered projects to all projects
        showToast('Projects refreshed successfully');
      } else {
        console.error('API did not return an array:', data);
        setProjects([]);
        setFilteredProjects([]);
      }
    } catch (error) {
      console.error('Failed to refresh projects:', error);
      showToast('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search query changes
  const handleSearch = (filters: any) => {
    if (typeof filters === 'string') {
      setSearchQuery(filters);
    } else {
      // Handle SearchFilters object
      setSearchQuery('');
      setFilters({
        category: filters.category === 'All Categories' ? 'ALL' : filters.category,
        status: filters.status === 'All Status' ? 'ALL' : filters.status,
        city: filters.location || '',
        state: '',
        priceRange: filters.priceRange || { min: 0, max: 10000000 },
      });
    }
  };
  
  // Handle filter changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  // Handle clearing filters
  const handleClearFilters = () => {
    setFilters({
      category: 'ALL',
      status: 'ALL',
      city: '',
      state: '',
      priceRange: { min: 0, max: 10000000 },
    });
    setSearchQuery('');
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('Project deleted');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMMERCIAL': return 'bg-blue-100 text-blue-800';
      case 'RETAIL_ONLY': return 'bg-green-100 text-green-800';
      case 'MIXED_USE': return 'bg-purple-100 text-purple-800';
      case 'RESIDENTIAL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_CONSTRUCTION': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden mt-16">
        {/* Sidebar */}
        <Sidebar variant="inset">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <h2 className="text-lg font-semibold">Projects</h2>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="overflow-y-auto">
           
            
            <Separator />
            
            <SidebarGroup>
              <SidebarGroupLabel>View Options</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 flex-1 text-xs"
                  >
                    <Squares2X2Icon className="h-3 w-3 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
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
              {/* <SidebarGroupLabel>Search & Filters</SidebarGroupLabel> */}
              <SidebarGroupContent className="space-y-4">
                {/* <ProjectSearchBar 
                  onSearch={handleSearch}
                  compact={true}
                /> */}
                <ProjectFilterSidebar 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="px-4 py-2 text-xs text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
              {toast}
            </div>
          )}
          
          {/* Header with sidebar toggle */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold">Projects Dashboard</h1>
            </div>
            
            {/* <div className="ml-auto flex items-center gap-2 px-4">
              {(searchQuery || filters.category !== 'ALL' || filters.status !== 'ALL' || filters.city || filters.state) && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div> */}
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-4 p-4 pt-0 overflow-y-auto">

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border shadow-sm animate-pulse">
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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No projects yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Create your first premium development project to showcase your portfolio.
              </p>
              <Link 
                href="/projects/new"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚀 Create First Project
              </Link>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <svg className="mx-auto h-24 w-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                No matching projects found
              </h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search criteria or filters to find what you&apos;re looking for.
              </p>
              <Button onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <div
                    key={project.id}
                    className="group bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => window.location.href = `/projects/${project.slug}`}
                  >
                <div className="relative overflow-hidden">
                  <img
                    src={project.featuredImage}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(project.category)} border border-white/20`}>
                      {project.category.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(project.status)} border border-white/20`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-yellow-500 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs leading-relaxed">
                      {project.subtitle}
                    </p>
                  )}

                  <div className="flex items-start text-gray-600 dark:text-gray-400 mb-4">
                    <span className="mr-2">📍</span>
                    <span className="text-xs">
                      {project.address}
                      {project.city && `, ${project.city}`}
                      {project.state && `, ${project.state}`}
                    </span>
                  </div>

                  {(project.minRatePsf || project.maxRatePsf) && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
                      <div className="text-green-700 dark:text-green-400 font-bold text-lg">
                        {project.minRatePsf || project.maxRatePsf}
                        {project.minRatePsf && project.maxRatePsf && project.minRatePsf !== project.maxRatePsf
                          ? ` - ${project.maxRatePsf}`
                          : ''}
                      </div>
                      <div className="text-green-600 dark:text-green-500 text-xs font-medium">per sq ft</div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                         {/* Created {new Date(project.createdAt).toLocaleDateString()} */}
                       </div>
                       <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                         <Link 
                           href={`/projects/${project.slug}`} 
                           className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                           onClick={(e) => e.stopPropagation()}
                         >
                           View
                         </Link>
                         <Link 
                           href={`/projects/new?edit=${project.slug}`} 
                           className="px-3 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                           onClick={(e) => e.stopPropagation()}
                         >
                           Edit
                         </Link>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDelete(project.id);
                           }} 
                           className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors duration-200" 
                           disabled={deletingId === project.id}
                         >
                           {deletingId === project.id ? 'Deleting...' : 'Delete'}
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="group bg-card  border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                onClick={() => window.location.href = `/projects/${project.slug}`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative">
                    <img
                      src={project.featuredImage}
                      alt={project.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(project.category)}`}>
                        {project.category.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {project.subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                          {project.subtitle}
                        </p>
                      )}
                      
                      <div className="flex items-start text-gray-600 dark:text-gray-400 mt-2">
                        <span className="mr-1">📍</span>
                        <span className="text-xs">
                          {project.address}
                          {project.city && `, ${project.city}`}
                          {project.state && `, ${project.state}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      {(project.minRatePsf || project.maxRatePsf) && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-1">
                          <span className="text-green-700 dark:text-green-400 font-bold">
                            {project.minRatePsf || project.maxRatePsf}
                            {project.minRatePsf && project.maxRatePsf && project.minRatePsf !== project.maxRatePsf
                              ? ` - ${project.maxRatePsf}`
                              : ''}
                            <span className="text-green-600 dark:text-green-500 text-xs font-medium ml-1">per sq ft</span>
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link 
                          href={`/projects/${project.slug}`} 
                          className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </Link>
                        <Link 
                          href={`/projects/new?edit=${project.slug}`} 
                          className="px-3 py-1.5 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }} 
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors duration-200" 
                          disabled={deletingId === project.id}
                        >
                          {deletingId === project.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
        )}

       
      </main>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-xl bg-black text-white shadow-lg">{toast}</div>
        </div>
      )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
