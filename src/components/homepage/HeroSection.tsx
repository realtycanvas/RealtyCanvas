"use client";

import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { BrandButton } from "../ui/BrandButton";
import ProjectSearchBar from "../ProjectSearchBar";

export default function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden lg:mb-10 mb-2 h-[700px] md:h-[100vh]  flex items-center justify-center  py-0 lg:py-6 mt-[-10vw] md:mt-[-1vw]"
    >
     {/* Desktop Background Image */}
      <SmartImage 
        src="/home.webp"
        alt="Hero Background"
        fill
        quality={100}
        className="hidden md:block object-cover object-center "
        priority
      />
      
      {/* Mobile Background Image */}
      <SmartImage 
        src="/home_page_banner_phone.png"
        alt="Hero Background Mobile"
        fill
        quality={100}
        className="block sm:hidden object-cover object-center "
        priority
      />
    
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 -z-10"></div>


      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center text-center   lg:space-y-6">
          {/* Main Heading */}
          <div className="lg:space-y-3 ">
            <div className="flex flex-col sm:flex-row items-center  justify-center gap-1  md:gap-4">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                Find Your
              </h1>
              <span className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                Dream Project
              </span>
            </div>

            <p className="text-xs  md:text-base  font-semibold text-white/90 leading-relaxed max-w-[280px] lg:max-w-2xl mx-auto px-2 pb-4 lg:pb-0">
              Discover premium residential homes and commercial spaces across Gurgaon with India&apos;s most trusted real estate consultant.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-4  md:gap-4 justify-center items-center w-full max-w-[200px] ">
            <Link href="/projects" className="w-full sm:w-auto">
              <BrandButton
                variant="primary"
                size="lg"
                className="rounded-xl  text-xs  md:text-sm px-3  md:px-4 py-2  md:py-3 w-full  "
              >
                Explore Projects
              </BrandButton>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <BrandButton
                variant="primary"
                size="lg"
                className="rounded-xl  text-xs  md:text-sm px-4  md:px-6 py-2  md:py-3 w-full "
              >
                Get In Touch
              </BrandButton>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="w-full max-w-[300px]  md:max-w-3xl mx-auto mt-3  px-2 sm:px-0 ">
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
