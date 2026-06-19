'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import BlogPostCard from '@/components/common/blog/blog-post-card';
import { BlogPostPreview } from '@/lib/sanity/types';

export default function LatestBlogsCarousel({ posts }: { posts: BlogPostPreview[] }) {
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
  }, [posts, updateScrollState]);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'right' ? el.clientWidth : -el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-8">
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
        {posts.map((post, index) => (
          <div
            key={post._id}
            className="snap-start shrink-0 w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] self-stretch"
          >
            <BlogPostCard post={post} index={index} />
          </div>
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
  );
}
