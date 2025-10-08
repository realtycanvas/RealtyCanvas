'use client';

import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export default function InfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  children,
  loadingComponent,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  return (
    <>
      {children}
      
      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="h-4" />
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          {loadingComponent || (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm">Loading more projects...</span>
            </div>
          )}
        </div>
      )}
      
      {/* End of results indicator */}
      {!hasMore && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You've reached the end of the results
          </p>
        </div>
      )}
    </>
  );
}