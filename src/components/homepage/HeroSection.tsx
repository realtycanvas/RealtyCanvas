"use client";

import Link from "next/link";
import Image from "next/image";
import { BrandButton } from "../ui/BrandButton";
import ProjectSearchBar from "../ProjectSearchBar";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center lg:py-0 py-12">
      {/* Background Image */}
      <Image
        src="/banner.webp"
        alt="Banner background"
        fill  // makes image fill the section
        priority // loads faster
        className="object-cover object-center -z-10" // keeps it behind content
      />
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div> */}

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 relative z-10">
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> */}
        <div className=" gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8 max-w-7xl mx-auto flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-center gap-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                  Find Your   <span className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tigh block bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                    Dream Project
                  </span>
                 
                </h1>
              
              </div>
              <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 text-center max-w-5xl mx-auto lg:mx-0 leading-relaxed">
                Discover premium properties across India with our curated
                collection of residential and commercial spaces
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center  items-center mb-12">
              <Link href="/projects">
                <BrandButton
                  variant="primary"
                  size="lg"
                  className="rounded-2xl min-w-[200px] "
                >
                  Explore Projects
                </BrandButton>
              </Link>
              <Link
                href="/projects/new"
                className="px-10 py-5 bg-transparent border-2 border-blue-950 text-blue-950 dark:border-white dark:text-white rounded-xl"
              >
                List Your Project
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  500+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Properties
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  1000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Clients
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cities
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Image */}
          {/* <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                alt="Modern Real Estate"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            </div>
          </div> */}
        </div>
        <ProjectSearchBar
          onSearch={(filters) => {
            // Navigate to projects page with filters
            const params = new URLSearchParams({
              category: filters.category,
              location: filters.location,
              status: filters.status,
              minPrice: filters.priceRange.min.toString(),
              maxPrice: filters.priceRange.max.toString(),
            });
            window.location.href = `/projects?${params.toString()}`;
          }}
        />
      </div>
    </section>
  );
}
