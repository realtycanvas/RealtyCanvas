import React from 'react'
import Image from 'next/image'

const Adventure = () => {
  return (
    <div>
        {/* Adventure Section - Let's go on an adventure */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Let&apos;s go on an adventure
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore the best places to stay in the world
              </p>
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex items-center space-x-4 ">
              <button 
                className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 "
                onClick={() => {
                  const container = document.getElementById('adventure-carousel');
                  if (container) {
                    container.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="w-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => {
                  const container = document.getElementById('adventure-carousel');
                  if (container) {
                    container.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Horizontal scrollable cities */}
          <div id="adventure-carousel" className="flex gap-6 overflow-x-auto scrollbar-hide">
            {/* Delhi */}
            <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg"
                  alt="Delhi, India"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delhi, India
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  144,000+ properties
                </p>
              </div>
            </div>

            {/* Gurugram */}
            <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg"
                  alt="Gurugram, India"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Gurugram, India
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  188,288+ properties
                </p>
              </div>
            </div>

            {/* Noida */}
            <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg"
                  alt="Noida, India"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Noida, India
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  218,288+ properties
                </p>
              </div>
            </div>

            {/* Faridabad */}
            <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                  alt="Faridabad, India"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Faridabad, India
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  116,288+ properties
                </p>
              </div>
            </div>

            {/* Ghaziabad */}
            <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                  alt="Ghaziabad, India"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Ghaziabad, India
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  232,288+ properties
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Adventure