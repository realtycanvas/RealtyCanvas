'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';
import { FireIcon } from '@heroicons/react/24/solid';

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
  isTrending?: boolean;
  totalClicks?: number;
};


interface TrendingProjectsSectionProps {
  projects?: Project[];
  loading?: boolean; // Controls initial skeleton; defaults to false
}

export default function TrendingProjectsSection({ projects = [], loading = false }: TrendingProjectsSectionProps) {
  // Use the projects provided by the server and avoid client refetches
  const trendingProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    // Keep order from server, cap to 6
    return projects.slice(0, 6);
  }, [projects]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <FireIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Trending
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Projects
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore the most popular and recently added projects that are gaining attention from buyers and investors
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : trendingProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {trendingProjects.map((project, index) => (
                <div key={project.id} className="relative">
                  {/* Trending Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                      <FireIcon className="w-3 h-3 mr-1" />
                      #{index + 1} Trending
                    </div>
                  )}
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/projects">
                <BrandButton
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none"
                >
                  <FireIcon className="mr-2 w-5 h-5" />
                  View All Projects
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </BrandButton>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FireIcon className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No trending projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Be the first to list a project and start the trend!
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 no-underline hover:no-underline focus:no-underline"
            >
              <FireIcon className="mr-2 w-5 h-5" />
              List Your Project
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}