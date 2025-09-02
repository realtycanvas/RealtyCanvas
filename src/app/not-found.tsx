'use client';

import Link from 'next/link';
import UnderMaintenanceLottie from '@/components/UnderMaintenanceLottie';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <UnderMaintenanceLottie width={150} height={150} />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or is currently under maintenance.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🏠 Go Home
            </Link>
            
            <div className="block">
              <Link 
                href="/projects"
                className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all duration-300"
              >
                📋 View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}