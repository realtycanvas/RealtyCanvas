import React from 'react'
import Image from 'next/image'

const Newsletter = () => {
  return (
    <section>
        {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Newsletter content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Join our newsletter
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Read and share new perspectives on just about any topic.
                  Everyone&apos;s welcome.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-4">
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    02
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Get premium magazines
                  </span>
                </div>
              </div>

              {/* Email subscription form */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 pr-16"
                />
                <button className="absolute right-2 top-2 bg-black hover:bg-gray-800 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="relative">
            <Image src="/news.webp" alt="Luxury Resort" width={500} height={500} className="object-contain" />
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Newsletter