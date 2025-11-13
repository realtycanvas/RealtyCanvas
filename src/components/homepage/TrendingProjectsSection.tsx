'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';
import { FireIcon } from '@heroicons/react/24/solid';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FireIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Trending <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Projects</span>
            </h2>
          </div>
          <Link href="/projects">
            <BrandButton
              variant="secondary"
              size="sm"
              className="rounded-2xl inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none"
            >
              <FireIcon className="mr-2 w-5 h-5" />
              View All
            </BrandButton>
          </Link>
        </div>

        {loading ? (
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-[360px] animate-pulse" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : trendingProjects.length > 0 ? (
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent>
              {trendingProjects.map((project, index) => (
                <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative">
                    {index < 3 && (
                      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <FireIcon className="w-3 h-3 mr-1" />
                        #{index + 1} Trending
                      </div>
                    )}
                    <ProjectCard project={project} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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