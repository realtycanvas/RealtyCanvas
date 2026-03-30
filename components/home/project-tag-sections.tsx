'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ViewAllLink from '@/components/ui/view-all-link';

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  status: string;
  city: string | null;
  featuredImage: string;
  basePrice: string | null;
  developerName: string | null;
  createdAt: string;
};

type SectionData = {
  totalCount: number;
  projects: Project[];
};

const useProjectTagSection = (tag: string) => {
  const [data, setData] = useState<SectionData>({ totalCount: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/projects?projectTag=${encodeURIComponent(tag)}&limit=3&page=1`);
        const json = await res.json();
        setData({
          totalCount: json?.pagination?.totalCount || 0,
          projects: Array.isArray(json?.data) ? json.data : [],
        });
      } catch {
        setData({ totalCount: 0, projects: [] });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [tag]);

  return { data, loading };
};

const ProjectTagSection = ({ tag, title, className }: { tag: string; title: ReactNode; className?: string }) => {
  const { data, loading } = useProjectTagSection(tag);

  if (loading) {
    return (
      <section className={`${className} py-20 bg-gray-200 relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <span className="w-10 h-10 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!data.projects.length) return null;

  return (
    <section className={`${className} py-20 bg-gray-200 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</div>
          <ViewAllLink href={`/projects?projectTag=${encodeURIComponent(tag)}`} label="View All" />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="bg-white rounded shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-44 bg-gray-100">
                {project.featuredImage && (
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{project.title}</h3>
                {project.subtitle && <p className="text-sm text-gray-600 mt-1">{project.subtitle}</p>}
                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  {project.city && <p>{project.city}</p>}
                  {project.developerName && <p>by {project.developerName}</p>}
                  {project.basePrice && <p className="text-yellow-600 font-semibold">{project.basePrice}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectTagSection;
