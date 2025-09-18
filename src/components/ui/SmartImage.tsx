'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  sizes?: string;
  quality?: number;
}

export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  loading = 'lazy',
  onLoad,
  onError,
  style,
  sizes,
  quality = 75
}: SmartImageProps) {
  const [useOptimization, setUseOptimization] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleOptimizationError = useCallback(() => {
    console.log('🔄 Image optimization failed, falling back to regular img tag:', src);
    setUseOptimization(false);
    onError?.();
  }, [src, onError]);

  const handleImageError = useCallback(() => {
    console.log('❌ Image failed to load:', src);
    setImageError(true);
    onError?.();
  }, [src, onError]);

  const handleImageLoad = useCallback(() => {
    console.log('✅ Image loaded successfully:', src);
    setImageError(false);
    onLoad?.();
  }, [src, onLoad]);

  // Show error placeholder if image failed to load
  if (imageError) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0, ...style } : { width, height, ...style }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
          <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  // Use Next.js Image optimization if available
  if (useOptimization) {
    // Check if it's a local image (starts with /) or external
    const isLocalImage = src.startsWith('/');
    const shouldUnoptimize = process.env.NODE_ENV === 'production' && !isLocalImage;
    
    return (
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={className}
        priority={priority}
        loading={priority ? undefined : loading}
        onLoad={handleImageLoad}
        onError={handleOptimizationError}
        style={style}
        sizes={sizes}
        quality={quality}
        unoptimized={shouldUnoptimize}
      />
    );
  }

  // Fallback to regular img tag when optimization fails
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={style}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={style}
    />
  );
}