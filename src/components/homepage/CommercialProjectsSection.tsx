'use client';

import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { BrandButton } from '../ui/BrandButton';

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
        <div className="flex items-center mb-10 justify-center text-center">
          <div>
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Commercial
               <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
              {" "} Projects
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Top commercial spaces curated for investors and businesses.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No commercial projects found.</p>
          </div>
        )}

        <div className="mt-10 text-center flex justify-center items-center">
          <Link href="/projects?category=COMMERCIAL">
            <BrandButton variant="primary">View All Commercial</BrandButton>
          </Link>
        </div>
      </div>
    </section>
  );
}