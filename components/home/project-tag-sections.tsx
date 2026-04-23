'use client';

import { useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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

const useProjectTagSection = (tag?: string, categoryType?: string) => {
  const [data, setData] = useState<SectionData>({ totalCount: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const param = categoryType
          ? `categoryType=${encodeURIComponent(categoryType)}`
          : `projectTag=${encodeURIComponent(tag || '')}`;
        const res = await fetch(`/api/projects?${param}&limit=20&page=1`);
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
  }, [tag, categoryType]);

  return { data, loading };
};

const ProjectTagSection = ({
  tag,
  categoryType,
  title,
  className,
}: {
  tag?: string;
  categoryType?: string;
  title: ReactNode;
  className?: string;
}) => {
  const { data, loading } = useProjectTagSection(tag, categoryType);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [data.projects, updateScrollState]);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'right' ? el.clientWidth : -el.clientWidth, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className={`${className} py-20 bg-gray-200 relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-50">
          <span className="w-10 h-10 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!data.projects.length) return null;

  return (
    <section className={`${className} py-20 bg-gray-200 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</div>
          <ViewAllLink
            href={
              categoryType === 'PLOTS'
                ? '/gurugram-residential-plots'
                : categoryType
                  ? `/projects?categoryType=${encodeURIComponent(categoryType)}`
                  : `/projects?projectTag=${encodeURIComponent(tag || '')}`
            }
            label="View All"
          />
        </div>

        <div className="relative">
          {/* Left arrow — sits in the section padding, outside the cards area */}
          <button
            onClick={() => scrollBy('left')}
            aria-label="Scroll left"
            className={`absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md ${canScrollLeft ? 'block' : 'hidden'}`}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          {/* Scroll container — same width as the title above */}
          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
          >
            {data.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="snap-start shrink-0 w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white rounded shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-44 bg-gray-100">
                  {project.featuredImage && (
                    <Image
                      src={project.featuredImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 25vw"
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

          {/* Right arrow — sits in the section padding, outside the cards area */}
          <button
            onClick={() => scrollBy('right')}
            aria-label="Scroll right"
            className={`absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md ${canScrollRight ? 'block' : 'hidden'}`}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectTagSection;
