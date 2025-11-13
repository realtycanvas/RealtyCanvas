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

export default function CommercialProjectsSection({ projects, loading }: { projects: Project[]; loading: boolean }) {
  return (
    <section className="py-10 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Commercial <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <Link href="/projects?category=COMMERCIAL">
            <BrandButton variant="primary" size="sm">View All</BrandButton>
          </Link>
        </div>

        {loading ? (
          <Carousel opts={{ align: 'start', dragFree: true }}>
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-[360px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : projects && projects.length > 0 ? (
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
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No commercial projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
}