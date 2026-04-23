'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  status: string;
  address: string;
  city: string | null;
  featuredImage: string;
  basePrice: string | null;
  developerName: string | null;
  locality: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

export default function BestPlotsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 0,
    hasMore: false,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProjects = useCallback(async (page: number, append: boolean) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const params = new URLSearchParams({ categoryType: 'PLOTS', page: String(page), limit: '12' });
      const res = await fetch(`/api/projects?${params}`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      const incoming: Project[] = Array.isArray(json.data) ? json.data : [];
      setProjects((prev) => {
        const seen = new Set(append ? prev.map((p) => p.id) : []);
        return append ? [...prev, ...incoming.filter((p) => !seen.has(p.id))] : incoming;
      });
      setPagination(json.pagination);
    } catch (e: any) {
      if (e?.name !== 'AbortError') console.error(e);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(1, false);
  }, [fetchProjects]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && pagination.hasMore && !loadingMore && !loading) {
          fetchProjects(pagination.page + 1, true);
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchProjects, loading, loadingMore, pagination.hasMore, pagination.page]);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      PLANNED: 'bg-yellow-100 text-yellow-800',
      UNDER_CONSTRUCTION: 'bg-amber-100 text-amber-800',
      READY: 'bg-green-100 text-green-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {loading ? (
        <div className="flex justify-center py-24">
          <span className="w-10 h-10 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg">No plots listed yet. Check back soon!</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-semibold">{projects.length}</span> of{' '}
            <span className="font-semibold">{pagination.totalCount}</span> plots
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="bg-white rounded shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  {project.featuredImage && (
                    <Image
                      src={project.featuredImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{project.title}</h2>
                  {project.subtitle && <p className="text-sm text-gray-500 mb-3 line-clamp-1">{project.subtitle}</p>}
                  <div className="space-y-1 text-sm">
                    {project.address && (
                      <p className="text-gray-600">
                        {project.address}{project.city ? `, ${project.city}` : ''}
                      </p>
                    )}
                    {project.developerName && (
                      <p className="text-gray-600">by {project.developerName}</p>
                    )}
                    {project.basePrice && (
                      <p className="text-yellow-600 font-semibold">{project.basePrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination.hasMore && (
            <div className="flex flex-col items-center gap-3 mt-10">
              <div ref={loadMoreRef} className="h-1 w-full" />
              {loadingMore && (
                <span className="w-6 h-6 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
