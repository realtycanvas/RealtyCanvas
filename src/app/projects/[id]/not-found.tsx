import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        The project you&apos;re looking for doesn&apos;t exist or has been removed.
        
      </p>
      <Link
        href="/projects"
        className="px-4 py-2 bg-brand-primary hover:bg-primary-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
      >
        Browse Projects
      </Link>
    </div>
  );
}