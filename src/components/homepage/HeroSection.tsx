"use client";

import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { BrandButton } from "../ui/BrandButton";
import ProjectSearchBar from "../ProjectSearchBar";

export default function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden min-h-[100dvh] md:min-h-[60vh] lg:min-h-[50vh] xl:min-h-[100vh] flex items-center justify-center py-0 mt-[-20vw] md:mt-[-6.25vw] lg:mt-[-4.15vw]"
    >
     {/* Desktop Background Image - Visible on sm (640px) and up */}
      <SmartImage 
        src="/homepage.webp"
        alt="Hero Background"
        fill
        quality={100}
        className="hidden sm:block object-cover object-center"
        priority
      />
      
      {/* Mobile Background Image - Visible below sm (640px) */}
      <SmartImage 
        src="/home-mobile.webp"
        alt="Hero Background Mobile"
        fill
        quality={100}
        className="block sm:hidden object-cover object-center"
        priority
      />
    
      {/* Background overlay for better text readability */}
      {/* Base dark tint */}
      <div className="absolute inset-0 bg-black/20 -z-20"></div>
      
      {/* Desktop Gradient - Left to Right */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#000]/50 via-[#112D48]/20 to-transparent z-10"></div>
      
      {/* Mobile/Tablet Gradient - Top to Bottom */}
      <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-[#000]/50 via-[#112D48]/20 to-transparent z-10"></div>


      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center lg:items-start justify-center h-full mt-20 sm:mt-24 lg:mt-0 z-20">
        <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 w-full lg:w-[60%]">
          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto lg:mx-0 lg:mr-auto">
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white drop-shadow-lg text-center lg:text-left">
                Find Your
              </h1>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent drop-shadow-sm text-center lg:text-left">
                Dream Project
              </span>
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-100 leading-relaxed max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 lg:mr-auto drop-shadow-md text-center lg:text-left">
              Discover premium residential homes and commercial spaces across Gurgaon with India&apos;s most trusted real estate consultant.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto lg:mx-0 lg:mr-auto">
            <Link href="/projects" className="w-full sm:w-auto">
              <BrandButton
                variant="primary"
                size="lg"
                className="rounded-xl text-sm sm:text-base px-6 py-3 sm:py-4 w-full sm:w-auto min-w-[160px] shadow-lg hover:scale-105 transition-transform"
              >
                Explore Projects
              </BrandButton>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <BrandButton
                variant="secondary"
                size="lg"
                className="rounded-xl text-sm sm:text-base px-6 py-3 sm:py-4 w-full sm:w-auto min-w-[160px] !bg-[#112D48] !text-white hover:!bg-[#091a30] shadow-lg hover:scale-105 transition-transform"
              >
                Get In Touch
              </BrandButton>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="w-full max-w-sm sm:max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto lg:mx-0 lg:mr-auto mt-4 sm:mt-8 px-2 sm:px-0">
            <ProjectSearchBar
              onSearch={(filters) => {
                // Navigate to projects page with filters
                const params = new URLSearchParams();
                // Only include category/status if user selected a specific option
                if (filters.category && filters.category !== 'All Categories') {
                  params.set('category', filters.category);
                }
                if (filters.status && filters.status !== 'All Status') {
                  params.set('status', filters.status);
                }
                // Include budget only when a range is chosen (not default Any Price)
                if (filters.priceRange.min > 0) {
                  params.set('minPrice', filters.priceRange.min.toString());
                }
                if (filters.priceRange.max > 0) {
                  params.set('maxPrice', filters.priceRange.max.toString());
                }
                const query = params.toString();
                window.location.href = query ? `/projects?${query}` : '/projects';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
