'use client';

import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';
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
};

interface FeaturedProjectsSectionProps {
  projects: Project[];
  loading: boolean;
}

export default function FeaturedProjectsSection({ projects, loading }: FeaturedProjectsSectionProps) {

  return (
    <section id="featured-projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Featured <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <Link href="/projects">
            <BrandButton variant="primary" size="sm">View All</BrandButton>
          </Link>
        </div>

        {loading ? (
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : projects.length > 0 ? (
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent>
              {projects.map((project) => (
                <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                  <ProjectCard project={project} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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
            
          </div>
        )}
      </div>
    </section>
  );
}