import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 py-3 text-sm flex-wrap">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-brand-primary transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium truncate max-w-50 sm:max-w-none">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
