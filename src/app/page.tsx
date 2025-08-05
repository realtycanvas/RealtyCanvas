"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchBar from "@/components/PropertySearchBar";
// import { supabase } from '@/lib/supabase';
// Define the Property type based on the Prisma schema
type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  featuredImage: string;
  galleryImages: string[];
  beds: number;
  baths: number;
  area: number;
  createdAt: Date;
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        console.log("Fetching properties from API...");
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        // Convert createdAt strings to Date objects
        const formattedData = (data || []).map((property: Property) => ({
          ...property,
          createdAt: new Date(property.createdAt),
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Reset loading state when navigating back to this page
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContactSuccess(true);
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col pt-16">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-brand-primary/20 to-brand-primary/20 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                  Find Your
                  <span className="block bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                    Dream Home
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Discover premium properties across India with our curated
                  collection of residential and commercial spaces
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Link
                  href="/properties"
                  className="bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-brand-primary/25 min-w-[200px]"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/properties/new"
                  className="border-2 border-gray-300 dark:border-gray-600 hover:border-brand-primary dark:hover:border-brand-primary text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-primary-50 dark:hover:bg-secondary-900/20 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 min-w-[200px]"
                >
                  List Your Property
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto lg:mx-0">
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
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                  alt="Modern Real Estate"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-primary rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Verified Property
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        100% Authentic
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Property Search Bar */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {" "}
                Property Search
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find your perfect property with our advanced search filters
            </p>
          </div>
          <PropertySearchBar
            onSearch={(filters) => {
              // Navigate to search results page with filters
              const params = new URLSearchParams({
                type: filters.type,
                location: filters.location,
                propertyType: filters.propertyType,
                minPrice: filters.priceRange.min.toString(),
                maxPrice: filters.priceRange.max.toString(),
              });
              window.location.href = `/properties/search?${params.toString()}`;
            }}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Benefits
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Happening cities
                </h2>
              </div>

              {/* Benefit 1 - Advertising */}
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                  Advertising
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cost-effective advertising
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  With a free listing, you can advertise your rental with no
                  upfront costs
                </p>
              </div>

              {/* Benefit 2 - Exposure */}
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                  Exposure
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reach millions with Chisfis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Millions of people are searching for unique places to stay
                  around the world
                </p>
              </div>

              {/* Benefit 3 - Secure */}
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-full">
                  Secure
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Secure and simple
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  A Holiday Lettings listing gives you a secure and easy way to
                  take bookings and payments online
                </p>
              </div>

             
            </div>

            {/* Right side - Image with overlays */}
            <div className="relative">
              <div className="relative w-full h-full lg:h-[800px]  overflow-hidden">
                <Image
                  src="/benefits.webp"
                  alt="Luxury Resort"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {" "}
                Properties
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium properties, carefully
              curated to match your lifestyle and investment goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                {/* Modern skeleton loading for property cards */}
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2 mb-2"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-1/3 mb-3"></div>
                      <div className="flex space-x-2 mb-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-12"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-12"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-12"></div>
                      </div>
                      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : properties.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-gradient-to-br from-primary-50 to-primary-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-brand-primary to-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No Properties Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Be the first to showcase your property on our platform
                  </p>
                  <Link
                    href="/properties/new"
                    className="inline-flex items-center bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Add Property
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              properties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="group transform hover:scale-105 transition-all duration-300"
                >
                  <PropertyCard property={property} />
                </div>
              ))
            )}
          </div>

          {properties.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/properties"
                className="inline-flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 group"
              >
                View All Properties
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

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


      {/* Gurugram Prime Locations Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Gurugram
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {" "}
                Prime Locations
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the most sought-after locations in Gurugram with premium
              properties and excellent connectivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cyber City */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg"
                  alt="Cyber City, Gurugram"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Cyber City</h3>
                  <p className="text-white/80">IT Hub & Corporate Offices</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Starting from
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    ₹2.5 Cr
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    Near Metro Station
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Premium Amenities
                  </div>
                </div>
              </div>
            </div>

            {/* Golf Course Road */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                  alt="Golf Course Road, Gurugram"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">
                    Golf Course Road
                  </h3>
                  <p className="text-white/80">Luxury Living & Golf Views</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Starting from
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    ₹4.2 Cr
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    Golf Course Views
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Luxury Amenities
                  </div>
                </div>
              </div>
            </div>

            {/* Sohna Road */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                  alt="Sohna Road, Gurugram"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Sohna Road</h3>
                  <p className="text-white/80">Affordable Luxury</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Starting from
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    ₹1.8 Cr
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    Good Connectivity
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Modern Amenities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Developers Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Top
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {" "}
                Developers
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Partner with India&apos;s most trusted real estate developers for
              quality construction and timely delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* DLF */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                  alt="DLF"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">DLF</h3>
                  <p className="text-white/80">Premium Properties</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Projects
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    50+
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Luxury Segment
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Trusted Brand
                  </div>
                </div>
              </div>
            </div>

            {/* Godrej */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg"
                  alt="Godrej"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Godrej</h3>
                  <p className="text-white/80">Quality Living</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Projects
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    35+
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Premium Quality
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Timely Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Tata Housing */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                  alt="Tata Housing"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Tata Housing</h3>
                  <p className="text-white/80">Affordable Luxury</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Projects
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    40+
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Value for Money
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Trusted Brand
                  </div>
                </div>
              </div>
            </div>

            {/* Hiranandani */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg"
                  alt="Hiranandani"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Hiranandani</h3>
                  <p className="text-white/80">Luxury Living</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Projects
                  </span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">
                    25+
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Ultra Luxury
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Premium Amenities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Properties Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trending
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent"> Properties</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore the most popular properties that are trending in the market right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <>
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700">
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <div className="p-6">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full w-1/2 mb-2"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-1/3"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : properties.length > 0 ? (
              properties.slice(0, 3).map((property) => (
                <div key={property.id} className="group transform hover:scale-105 transition-all duration-300">
                  <PropertyCard property={property} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-gradient-to-br from-primary-50 to-primary-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-brand-primary to-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Trending Properties</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Check back soon for trending properties</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Projects Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Upcoming
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent"> Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be the first to know about exciting new projects launching soon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg" 
                  alt="Luxury Heights" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Coming Soon</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Luxury Heights</h3>
                  <p className="text-white/80">Gurugram • Launch: Dec 2024</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting Price</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹3.2 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    2, 3, 4 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Golf Course Road
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg" 
                  alt="Smart City Living" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Pre-launch</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Smart City Living</h3>
                  <p className="text-white/80">Noida • Launch: Jan 2025</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting Price</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹2.8 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    1, 2, 3 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Sector 150
                  </div>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                  alt="Green Valley" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Early Bird</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Green Valley</h3>
                  <p className="text-white/80">Faridabad • Launch: Feb 2025</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting Price</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹1.5 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    2, 3 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Sector 21C
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury For You Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Luxury
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent"> For You</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the epitome of luxury living with our exclusive collection of premium properties
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Ultra Luxury Living</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Discover properties that redefine luxury with world-class amenities, stunning architecture, and prime locations. 
                  From private pools to concierge services, experience living at its finest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Private Pool</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Exclusive swimming pools for residents</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Concierge Service</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">24/7 personalized assistance</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Home</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Advanced automation systems</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Round-the-clock security</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/properties" 
                  className="inline-flex items-center bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Explore Luxury Properties
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg" 
                  alt="Luxury Living" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Floating stats */}
                <div className="absolute top-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹5Cr+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Luxury Units</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best For You Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Best
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent"> For You</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Personalized recommendations based on your preferences and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Family Homes */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg" 
                  alt="Family Homes" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Family Homes</h3>
                  <p className="text-white/80">Perfect for growing families</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹2.5 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3-4 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Schools Nearby
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Properties */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg" 
                  alt="Investment Properties" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Investment Properties</h3>
                  <p className="text-white/80">High rental yield</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹1.8 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    8-10% ROI
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Prime Location
                  </div>
                </div>
              </div>
            </div>

            {/* Senior Living */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                  alt="Senior Living" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Senior Living</h3>
                  <p className="text-white/80">Comfortable retirement</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                  <span className="text-lg font-bold text-brand-primary dark:text-brand-primary">₹2.2 Cr</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Medical Facilities
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 Care
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-brand-primary/10 to-brand-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                {" "}
                Us
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled service with our comprehensive suite of
              real estate solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Premium Listings
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Access our curated collection of premium properties with
                detailed insights and professional photography
              </p>
            </div>

            {/* Service 2 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Smart Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                AI-powered property management solutions that optimize your
                investment returns and tenant satisfaction
              </p>
            </div>

            {/* Service 3 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Expert Consultation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Get personalized guidance from our certified real estate experts
                for informed investment decisions
              </p>
            </div>

            {/* Service 4 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Secure Transactions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Bank-grade security and escrow services ensure your transactions
                are safe and transparent
              </p>
            </div>

            {/* Service 5 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Quick Process
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Streamlined digital processes that reduce paperwork and
                accelerate your property journey
              </p>
            </div>

            {/* Service 6 */}
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Round-the-clock customer support to assist you at every step of
                your real estate journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Find Your
              <span className="block text-yellow-300"> Dream Property?</span>
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-100 leading-relaxed">
              Join thousands of satisfied customers who found their perfect home
              with Reality Canvas. Start your journey today and discover
              properties that match your dreams.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href="/properties"
                className="bg-white text-brand-secondary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 min-w-[220px]"
              >
                Explore Properties
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white/50 hover:border-white text-white hover:bg-white/10 font-bold py-4 px-10 rounded-full transition-all duration-300 backdrop-blur-sm min-w-[220px]"
              >
                Get Expert Advice
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                  5,000+
                </div>
                <div className="text-gray-200">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                  10,000+
                </div>
                <div className="text-gray-200">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                  15+
                </div>
                <div className="text-gray-200">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Budget
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent"> Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Quality homes at affordable prices - your dream home is within reach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Budget Project 1 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg" 
                  alt="Affordable Homes" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Affordable</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Affordable Homes</h3>
                  <p className="text-white/80">Starting ₹45L</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    1, 2 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready to Move
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Project 2 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/2387869/pexels-photo-2387869.jpeg" 
                  alt="Smart Budget" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold">Smart</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Smart Budget</h3>
                  <p className="text-white/80">Starting ₹55L</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2, 3 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Under Construction
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Project 3 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" 
                  alt="Value Homes" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Value</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Value Homes</h3>
                  <p className="text-white/80">Starting ₹65L</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2, 3 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Possession Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Project 4 */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="relative h-48">
                <Image 
                  src="https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg" 
                  alt="Economy Living" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Economy</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">Economy Living</h3>
                  <p className="text-white/80">Starting ₹35L</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    1 BHK
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ready to Move
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Get In
                <span className="bg-gradient-to-r from-brand-primary to-brand-primary bg-clip-text text-transparent">
                  {" "}
                  Touch
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Ready to start your real estate journey? Our expert team is here
                to help you every step of the way
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a message
                </h3>

                {contactSuccess ? (
                  <div
                    className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-2xl relative mb-6"
                    role="alert"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <strong className="font-bold">Thank you!</strong>
                        <span className="block sm:inline">
                          {" "}
                          We&apos;ve received your message and will get back to
                          you soon.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none"
                        placeholder="Tell us about your requirements..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-primary hover:from-primary-600 hover:to-primary-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex justify-center items-center"
                      disabled={contactSubmitting}
                    >
                      {contactSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-3xl shadow-lg border border-primary-100 dark:border-gray-600">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-primary p-3 rounded-2xl flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Visit Our Office
                      </h3>
                      <address className="not-italic text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>123 Connaught Place</p>
                        <p>New Delhi, 110001</p>
                        <p>India</p>
                      </address>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-3xl shadow-lg border border-green-100 dark:border-gray-600">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-2xl flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Call Us
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        +91 98765 43210
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        +91 11 2345 6789
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 p-8 rounded-3xl shadow-lg border border-orange-100 dark:border-gray-600">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Office Hours
                      </h3>
                      <div className="text-gray-600 dark:text-gray-300 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
