'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use a timestamp query parameter to bypass cache
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
        console.log('Projects API response:', data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('API did not return an array:', data);
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
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
        showToast('Projects refreshed successfully');
      } else {
        console.error('API did not return an array:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to refresh projects:', error);
      showToast('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
          {toast}
        </div>
      )}
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">Premium Projects</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Discover our exclusive portfolio of commercial and residential developments
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={refreshProjects} 
                disabled={loading}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link 
                href="/projects/new" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ✨ Create New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <div
                key={project.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => window.location.href = `/projects/${project.id}`}
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
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {project.subtitle}
                    </p>
                  )}

                  <div className="flex items-start text-gray-600 dark:text-gray-400 mb-4">
                    <span className="mr-2">📍</span>
                    <span className="text-sm">
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
                      <div className="text-green-600 dark:text-green-500 text-sm font-medium">per sq ft</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/projects/${project.id}`} 
                        className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                      <Link 
                        href={`/projects/new?edit=${project.id}`} 
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
            ))}
          </div>
        )}

        {/* Legacy Properties Link */}
        <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-3xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Legacy Properties</h2>
            <p className="text-gray-300 mb-8">
              Explore properties created with our legacy system for reference and comprehensive testing.
            </p>
            <Link 
              href="/properties" 
              className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              🏠 Browse Legacy Properties
            </Link>
          </div>
        </div>
      </main>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-xl bg-black text-white shadow-lg">{toast}</div>
        </div>
      )}
    </div>
  );
}
