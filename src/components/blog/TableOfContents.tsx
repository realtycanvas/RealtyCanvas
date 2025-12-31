'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Find all H1-H5 headings in the article content
    const articleContent = document.querySelector('article');
    if (!articleContent) return;

    const elements = articleContent.querySelectorAll('h1, h2, h3, h4, h5');
    const items: TOCItem[] = [];

    elements.forEach((element, index) => {
      // Cast to HTMLElement to access style property
      const htmlElement = element as HTMLElement;
      
      // Generate ID if missing
      if (!htmlElement.id) {
        htmlElement.id = `heading-${index}`;
      }
      
      // Add scroll-margin-top for better positioning when scrolling
      htmlElement.style.scrollMarginTop = '100px';

      items.push({
        id: htmlElement.id,
        text: htmlElement.textContent || '',
        level: parseInt(htmlElement.tagName.substring(1)),
      });
    });

    setHeadings(items);

    // Setup intersection observer for active state
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  const getFontSize = (level: number) => {
    switch (level) {
      case 1: return '1rem';       // 16px
      case 2: return '0.925rem';   // ~14.8px
      case 3: return '0.85rem';    // ~13.6px
      case 4: return '0.8rem';     // ~12.8px
      default: return '0.75rem';   // ~12px (for normal/smaller text)
    }
  };

  const getFontWeight = (level: number, isActive: boolean) => {
    if (isActive) return '600';
    switch (level) {
      case 1: return '600';
      case 2: return '500';
      case 3: return '500';
      default: return '400';
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 border-b border-gray-100 dark:border-gray-700">
          Quick Navigation
        </h4>
        <nav className="space-y-1 relative z-0">
          {headings.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                  setActiveId(item.id);
                }}
                className={`block transition-colors duration-200 hover:text-brand-primary leading-snug py-1.5 ${
                  isActive
                    ? 'text-brand-primary'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                style={{
                  paddingLeft: `${(item.level - 1) * 16}px`,
                  fontSize: getFontSize(item.level),
                  fontWeight: getFontWeight(item.level, isActive),
                  opacity: item.level > 2 && !isActive ? 0.85 : 1
                }}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
