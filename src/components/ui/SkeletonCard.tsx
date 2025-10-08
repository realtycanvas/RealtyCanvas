'use client';

interface SkeletonCardProps {
  viewMode?: 'grid' | 'list';
}

export default function SkeletonCard({ viewMode = 'grid' }: SkeletonCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg border shadow-sm animate-pulse overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="w-full sm:w-64 h-48 sm:h-40 bg-muted flex-shrink-0"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 p-4 sm:p-6 space-y-3">
            {/* Title */}
            <div className="h-6 bg-muted rounded w-3/4"></div>
            
            {/* Subtitle */}
            <div className="h-4 bg-muted rounded w-1/2"></div>
            
            {/* Address */}
            <div className="h-4 bg-muted rounded w-full"></div>
            
            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded-full w-20"></div>
              <div className="h-6 bg-muted rounded-full w-24"></div>
            </div>
            
            {/* Price */}
            <div className="h-8 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm animate-pulse overflow-hidden">
      {/* Image skeleton */}
      <div className="w-full h-48 sm:h-56 md:h-64 bg-muted"></div>
      
      {/* Content skeleton */}
      <div className="p-4 sm:p-6 md:p-8 space-y-3">
        {/* Title */}
        <div className="h-6 bg-muted rounded w-3/4"></div>
        
        {/* Subtitle */}
        <div className="h-4 bg-muted rounded w-1/2"></div>
        
        {/* Address */}
        <div className="h-4 bg-muted rounded w-full"></div>
        
        {/* Price box */}
        <div className="bg-muted rounded-xl p-3 sm:p-4 space-y-2">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        
        {/* Action buttons (for admin) */}
        <div className="flex gap-2 pt-2">
          <div className="h-7 bg-muted rounded w-12"></div>
          <div className="h-7 bg-muted rounded w-12"></div>
          <div className="h-7 bg-muted rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Multiple skeleton cards component
export function SkeletonCards({ count = 6, viewMode = 'grid' }: { count?: number; viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4 sm:space-y-6">
        {[...Array(count)].map((_, i) => (
          <SkeletonCard key={i} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} viewMode="grid" />
      ))}
    </div>
  );
}