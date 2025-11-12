'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';
import { useAuth } from '@/contexts/AuthContext';

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

interface FeaturedProjectsSectionProps {
  projects: Project[];
  loading: boolean;
}

export default function FeaturedProjectsSection({ projects, loading }: FeaturedProjectsSectionProps) {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9; // 3 columns × 3 rows
  
  // Calculate pagination
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);
  
  // Reset to first page when projects change
  useEffect(() => {
    setCurrentPage(1);
  }, [projects]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section
    document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Previous
        </button>
      );
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'text-white bg-brand-primary border border-brand-primary'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Next
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <section id="featured-projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured
            <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
              {" "}
              Projects
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our hand-picked selection of premium projects that offer
            exceptional value and prime locations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mb-12">
                <div className="flex items-center space-x-1">
                  {renderPaginationButtons()}
                </div>
              </div>
            )}
            
            {/* Show results info */}
            {totalPages > 1 && (
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(endIndex, projects.length)} of {projects.length} projects
                </p>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/projects">
                <BrandButton
                  variant="primary"
                  size="lg"
                  className="rounded-2xl inline-flex items-center">
                  View All Projects
                </BrandButton>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No projects available
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We&apos;re working on adding amazing projects. Check back soon!
            </p>
            {isAdmin && (
              <Link
                href="/projects/new"
                className="inline-flex items-center bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 no-underline hover:no-underline focus:no-underline"
              >
                Add Your Project
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}