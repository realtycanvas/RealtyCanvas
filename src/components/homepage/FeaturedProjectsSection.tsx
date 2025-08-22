'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
  });

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"
              ></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            {/* Shadcn Carousel */}
            <div className="relative mb-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin]}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {projects.map((project) => (
                    <CarouselItem key={project.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <ProjectCard project={project} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-12 bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700" />
                <CarouselNext className="-right-12 bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700" />
              </Carousel>
            </div>
            
            <div className="text-center">
              <Link href="/projects">
                <BrandButton
                  variant="primary"
                  size="lg"
                  className="rounded-2xl inline-flex items-center"
                >
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
            <Link
              href="/projects/new"
              className="inline-flex items-center bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 no-underline hover:no-underline focus:no-underline"
            >
              Add Your Project
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}