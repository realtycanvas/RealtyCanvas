"use client";

import SmartImage from "@/components/ui/SmartImage";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HeartIcon,
  ShareIcon,
  EyeIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  VideoCameraIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import UnitsSection from "@/components/Notes/Units";
import LazySection from "@/components/LazySection";
import PropertyFAQ from "@/components/PropertyFAQ";

type Unit = {
  id: string;
  unitNumber: string;
  type: string;
  floor: string;
  areaSqFt: number;
  ratePsf?: number | null;
  priceTotal?: number | null;
  availability: string;
  notes?: string | null;
};

type Highlight = {
  id: string;
  label: string;
  icon?: string | null;
};

type Amenity = {
  id: string;
  category: string;
  name: string;
  details?: string | null;
  icon?: string | null;
};

type AnchorTenant = {
  id: string;
  name: string;
  category: string;
  floor?: string | null;
  areaSqFt?: number | null;
  status: string;
  icon?: string | null;
};

type NearbyPoint = {
  id: string;
  type: string;
  name: string;
  distanceKm?: number | null;
  travelTimeMin?: number | null;
};

type FloorPlan = {
  id: string;
  level: string;
  title?: string | null;
  imageUrl: string;
  details?: any;
  sortOrder?: number;
};

type PricingPlan = {
  id: string;
  name: string;
  planType: string;
  schedule?: any;
  taxes?: any;
  charges?: any;
  notes?: string | null;
};

type PricingTableRow = {
  id: string;
  type: string;
  reraArea: string;
  price: string;
  pricePerSqft?: string | null;
  availableUnits?: number | null;
  floorNumbers?: string | null;
  features?: any;
};

type Faq = {
  id: string;
  question: string;
  answer?: string | null;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  category: string;
  status: string;
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  galleryImages: string[];
  reraId?: string | null;
  developerName?: string | null;
  possessionDate?: string | null;
  basePrice?: number | string | null;
  priceRange?: string | null;
  minRatePsf?: number | string | null;
  maxRatePsf?: number | string | null;
  latitude?: number | null;
  longitude?: number | null;
  sitePlanImage?: string | null;
  // Commercial project specific fields

  numberOfFloors?: number | string | null;

  features?: string | null;
  units: Unit[];
  highlights: Highlight[];
  amenities: Amenity[];
  anchors: AnchorTenant[];
  floorPlans: FloorPlan[];
  pricingPlans: PricingPlan[];
  pricingTable: PricingTableRow[];
  faqs: Faq[];
  nearbyPoints: NearbyPoint[];
  videoUrl?: string | null;
  videoUrls?: string[];
  // Residential project specific fields
  landArea?: string | null;
  numberOfTowers?: number | null;
  numberOfApartments?: number | null;
};

interface ProjectDetailClientProps {
  project: Project;
  slug: string;
}

export default function ProjectDetailClient({
  project,
  slug,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const callNowButtonRef = useRef<HTMLAnchorElement | null>(null);

  // Handle back navigation to preserve pagination state
  const handleBackToProjects = () => {
    // Check if there's a referrer from the projects page
    if (document.referrer && document.referrer.includes("/projects")) {
      router.back();
    } else {
      // Fallback to projects page
      router.push("/projects");
    }
  };

  const [isLiked, setIsLiked] = useState(false);
  const [viewAllPhotos, setViewAllPhotos] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [contactOpen, setContactOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Simple toast state
  const [toast, setToast] = useState("");

  // FAQ expanded state
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Units pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [unitsPerPage] = useState(7);

  // Refs for section navigation
  const overviewRef = useRef<HTMLDivElement>(null);
  const unitsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const floorPlansRef = useRef<HTMLDivElement>(null);
  const amenitiesRef = useRef<HTMLDivElement>(null);
  const anchorsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Initialize like state from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("likedProjects");
        if (raw) {
          const liked: string[] = JSON.parse(raw);
          setIsLiked(liked.includes(slug));
        }
      } catch {
        // ignore
      }
    }
  }, [slug]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const toggleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      try {
        const key = "likedProjects";
        const raw = localStorage.getItem(key);
        const arr: string[] = raw ? JSON.parse(raw) : [];
        const idx = arr.indexOf(slug);
        if (next && idx === -1) arr.push(slug);
        if (!next && idx !== -1) arr.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(arr));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(!isLiked ? "Added to favorites" : "Removed from favorites");
  };

  const scrollToSection = (
    sectionRef: React.RefObject<HTMLDivElement>,
    tabName: string
  ) => {
    setActiveTab(tabName);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const shareData = {
      title: project?.title ?? "Project",
      text: project?.subtitle ?? "Check out this project",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Share dialog opened");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Link copied to clipboard");
      }
    } catch {
      showToast("Unable to share");
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactOpen(false);
    showToast("Thanks! The agent will contact you shortly.");
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInfoOpen(false);
    showToast("Your request for information has been sent.");
  };

  const handleTourSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTourOpen(false);
    showToast("Tour scheduled! We will confirm availability.");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4 mt-10">
          <button
            onClick={handleBackToProjects}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Projects
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[70vh] overflow-hidden max-w-7xl mx-auto rounded-3xl">
              <Image
                src={
                  (project.galleryImages &&
                    project.galleryImages[activeImageIndex]) ||
                  project.featuredImage
                }
                alt={project.title}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                onLoad={() => {
                  // Mark LCP image as loaded for performance tracking
                  if (typeof window !== "undefined" && window.performance) {
                    window.performance.mark("hero-image-loaded");
                  }
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>
              {/* Action Buttons - Top Right */}
              <div className="absolute top-6 right-6 flex items-center space-x-3">
                <button
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ClipboardDocumentIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* View All Photos Button - Bottom Right */}
              <button
                onClick={() => setViewAllPhotos(true)}
                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg lg:flex items-center space-x-2 hover:bg-white transition-colors hidden "
              >
                <PhotoIcon className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  View All Photos
                </span>
              </button>

              {/* Gallery Preview - Bottom Left */}
              {project.galleryImages.length > 0 && (
                <div className="absolute bottom-6 left-6 flex space-x-2">
                  {project.galleryImages.slice(0, 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`rounded-lg border-2 ${
                        activeImageIndex === index
                          ? "border-blue-500"
                          : "border-white/50"
                      }`}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {project.address}
                  {project.city ? `, ${project.city}` : ""}
                  {project.state ? `, ${project.state}` : ""}
                </span>
              </div>

              {project.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  {/* {project.subtitle} */}
                </p>
              )}
            </div>

            {/* About This Property */}
            <div
              ref={overviewRef}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                About This Property
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Project Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 justify-center">
                <div className="text-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Type
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {project.category === "COMMERCIAL"
                      ? "Commercial"
                      : project.category === "RESIDENTIAL"
                      ? "Residential"
                      : project.category.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Highlights */}
            {project.highlights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Property Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
                    >
                      {highlight.icon && (
                        <span className="text-2xl">{highlight.icon}</span>
                      )}
                      <div>
                        <div className="font-semibold text-xs text-gray-900 dark:text-white">
                          {highlight.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Section - Lazy Loaded */}
            {project.amenities.length > 0 && (
              <LazySection>
                <div
                  ref={amenitiesRef}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Amenities & Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
                      >
                        {amenity.icon && (
                          <span className="text-2xl">{amenity.icon}</span>
                        )}
                        <BuildingOfficeIcon className="text-yellow-400 dark:text-gray-400 w-[2vw]" />
                        <div>
                          <div className="font-semibold text-xs text-gray-900 dark:text-white">
                            {amenity.name}
                          </div>
                          {amenity.details && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {amenity.details}
                            </div>
                          )}
                          <div className="text-xs text-blue-600 capitalize">
                            {amenity.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LazySection>
            )}

            {/* Units Section - Only for Residential Projects */}
            <UnitsSection project={project} />

            {/* Location & Nearby Points Section - Lazy Loaded */}
            <LazySection>
              <div
                ref={locationRef}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Location & Connectivity
                </h2>

                {/* Project Location */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <MapPinIcon className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Project Location
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {project.address}
                      </p>
                      {project.city && project.state && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {project.city}, {project.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Map */}
                {project.sitePlanImage && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Location Map
                    </h3>
                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative aspect-video">
                      <SmartImage
                        src={project.sitePlanImage}
                        alt="Project Location Map"
                        fill
                        className="object-cover"
                        loading="lazy"
                        onLoad={() =>
                          console.log("✅ Site plan image loaded successfully")
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Nearby Points */}
              </div>
            </LazySection>

            {/* Floor Plans Section - Lazy Loaded */}
            {project.floorPlans && project.floorPlans.length > 0 ? (
              <LazySection>
                <div
                  ref={floorPlansRef}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Floor Plans
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.floorPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {plan.imageUrl && (
                          <div className="aspect-video relative">
                            <SmartImage
                              src={plan.imageUrl}
                              alt={`${plan.level} floor plan`}
                              fill
                              className="object-cover"
                              loading="lazy"
                              onLoad={() =>
                                console.log(
                                  `✅ Floor plan image loaded: ${plan.level}`
                                )
                              }
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {plan.level}
                            {plan.title && (
                              <span className="text-blue-600 ml-2">
                                • {plan.title}
                              </span>
                            )}
                          </h3>
                          {plan.details && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {plan.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </LazySection>
            ) : (
              <LazySection>
                <div
                  ref={floorPlansRef}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Floor Plans
                  </h2>
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                      Floor plans will be available soon.
                    </p>
                  </div>
                </div>
              </LazySection>
            )}

            {/* Videos Section - Lazy Loaded */}
            <LazySection>
              <div
                ref={videoRef}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Property Videos
                </h2>

                {project.videoUrl ||
                (project.videoUrls && project.videoUrls.length > 0) ? (
                  <div className="space-y-6">
                    {/* Main Video */}
                    {project.videoUrl && (
                      <div className="aspect-video relative rounded-xl overflow-hidden bg-black">
                        <video
                          controls
                          className="w-full h-full"
                          poster={project.featuredImage}
                        >
                          <source src={project.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {/* Additional Videos */}
                    {project.videoUrls && project.videoUrls.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          More Videos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.videoUrls.map((video, index) => (
                            <div
                              key={index}
                              className="aspect-video relative rounded-lg overflow-hidden bg-black"
                            >
                              <video
                                controls
                                className="w-full h-full"
                                poster={project.featuredImage}
                              >
                                <source src={video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <VideoCameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Property videos will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </LazySection>

            {/* About the Builder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                RERA ID
              </h2>
              <div className="flex items-start space-x-6">
                <div>
                  {project.reraId && (
                    <div className="text-sm text-blue-500 font-bold dark:text-gray-400">
                      RERA ID: {project.reraId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FAQ Section - Lazy Loaded */}
            <LazySection>
              <div ref={faqRef}>
                <PropertyFAQ
                  faqs={
                    project.faqs?.map((faq) => ({
                      question: faq.question,
                      answer: faq.answer || "",
                    })) || []
                  }
                  title="Frequently Asked Questions"
                />
              </div>
            </LazySection>
          </div>

          {/* Right Column - Contact & Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-14 space-y-6">
              {/* Property Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h3>

                <div className="space-y-4">
                  {/* Price Information */}
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    {project.basePrice ? (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          ₹{project.basePrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          Starting Price
                        </div>
                      </div>
                    ) : project.priceRange ? (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {project.priceRange}
                        </div>
                        <div className="text-sm text-gray-500">Price Range</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-600 mb-1">
                          Contact for Pricing
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {project.category?.toLowerCase() === "residential" ? (
                      // Residential Project Stats
                      <>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {project.landArea || "2.5 "}{" "}
                            <span className="text-sm text-blue-500">Acres</span>
                          </div>
                          <div className="text-sm text-red-500 font-semibold">
                            Land Area
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-black">
                            {project.numberOfTowers ||
                              Math.max(1, Math.ceil(project.units.length / 50))}
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            Towers
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-black">
                            {project.numberOfApartments ||
                              project.units.filter(
                                (unit) =>
                                  unit.type
                                    .toLowerCase()
                                    .includes("apartment") ||
                                  unit.type.toLowerCase().includes("studio") ||
                                  unit.type.toLowerCase().includes("bhk")
                              ).length ||
                              project.units.length}
                          </div>
                          <div className="text-sm font-semibold text-blue-700">
                            Apartments
                          </div>
                        </div>
                      </>
                    ) : (
                      // Commercial Project Stats - Land Area/No. of Floors/Category
                      <>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {project.landArea || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">Land Area</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {project.numberOfFloors || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            No. of Floors
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {project.features || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">Features</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        project.status === "READY"
                          ? "bg-green-100 text-green-800"
                          : project.status === "UNDER_CONSTRUCTION"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Key Features */}
                  {project.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 2).map((highlight) => (
                          <li
                            key={highlight.id}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {highlight.label}
                          </li>
                        ))}
                        {project.highlights.length > 2 && (
                          <button
                            onClick={() => setShowAllFeatures(true)}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                          >
                            +{project.highlights.length - 2} more features
                          </button>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Interested in this property?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get in touch for more details and viewing
                </p>

                <div className="space-y-3">
                  <Link
                    href="tel:9910007801"
                    ref={callNowButtonRef}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </Link>
                  <button
                    onClick={handleShare}
                    className="w-full text-gray-600 dark:text-gray-400 py-2 flex items-center justify-center"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {viewAllPhotos &&
        project.galleryImages &&
        project.galleryImages.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Photo Gallery
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewAllPhotos(false)}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 grid grid-rows-[1fr_auto]">
                {/* Large preview */}
                <div className="relative bg-black">
                  <Image
                    src={project.galleryImages[activeImageIndex]}
                    alt={`Photo ${activeImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority={activeImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                  <button
                    onClick={() => {
                      setActiveImageIndex(
                        (activeImageIndex - 1 + project.galleryImages.length) %
                          project.galleryImages.length
                      );
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => {
                      setActiveImageIndex(
                        (activeImageIndex + 1) % project.galleryImages.length
                      );
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
                {/* Thumbnails */}
                <div className="p-4 overflow-x-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-3 min-w-full">
                    {project.galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`rounded-lg border ${
                          i === activeImageIndex
                            ? "border-blue-500"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumb ${i + 1}`}
                          width={96}
                          height={80}
                          className="w-24 h-20 object-cover rounded-lg"
                          sizes="96px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Agent
              </h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <input
                required
                placeholder="Your name"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <input
                required
                type="tel"
                placeholder="Phone"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                >
                  Send Message
                </button>
                <a
                  href="tel:9910007801"
                  className="w-full bg-yellow-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg text-center flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call Now: 9910007801
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Features Modal */}
      {showAllFeatures && project && project.highlights && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Key Features
              </h3>
              <button
                onClick={() => setShowAllFeatures(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.highlights.map((highlight, index) => (
                  <div
                    key={highlight.id}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {highlight.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-xl bg-black text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
