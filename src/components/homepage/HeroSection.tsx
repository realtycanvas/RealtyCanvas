"use client";

import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { BrandButton } from "../ui/BrandButton";
import ProjectSearchBar from "../ProjectSearchBar";

export default function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden lg:mb-10 mb-2 min-h-screen h-screen max-h-screen flex items-center  py-0 lg:py-12"
    >
     {/* Desktop Background Image */}
      <SmartImage 
        src="/home.png"
        alt="Hero Background"
        fill
        quality={100}
        className="hidden sm:block object-cover object-center"
        priority
      />
      
      {/* Mobile Background Image */}
      <SmartImage 
        src="/home_page_banner_phone.png"
        alt="Hero Background Mobile"
        fill
        quality={100}
        className="block sm:hidden object-cover object-center mt-[-10.5vw]"
        priority
      />
    
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 -z-10"></div>
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div> */}

      {/* Floating Elements */}
      {/* <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-2xl"></div> */}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full">
        <div className="flex flex-col items-center justify-center text-center space-y-4  md:space-y-8">
          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-center mt-[-10vw] lg:mt-0 justify-center gap-1 sm:gap-2 md:gap-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                Find Your
              </h1>
              <span className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                Dream Project
              </span>
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold lg:font-semibold text-white/90 leading-relaxed max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-4">
              Discover premium residential homes and commercial spaces across Gurgaon with India&apos;s most trusted real estate consultant.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full max-w-md sm:max-w-none">
            <Link href="/projects" className="w-full sm:w-auto">
              <BrandButton
                variant="primary"
                size="lg"
                className="rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-full sm:w-auto sm:min-w-[160px]"
              >
                Explore Projects
              </BrandButton>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <BrandButton
                variant="primary"
                size="lg"
                className="rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-full sm:w-auto sm:min-w-[160px]"
              >
                Get In Touch
              </BrandButton>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-xl mx-auto mt-3 sm:mt-4 md:mt-6 lg:mt-8 px-2 sm:px-0">
            <ProjectSearchBar
              onSearch={(filters) => {
                // Navigate to projects page with filters
                const params = new URLSearchParams({
                  category: filters.category,
                  status: filters.status,
                });
                window.location.href = `/projects?${params.toString()}`;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
