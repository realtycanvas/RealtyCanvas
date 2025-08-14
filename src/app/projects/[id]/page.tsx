"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

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
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!id) return;
    
    (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch project: ${res.status}`);
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Initialize like state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("likedProjects");
      if (raw) {
        const liked: string[] = JSON.parse(raw);
        setIsLiked(liked.includes(id));
      }
    } catch {
      // ignore
    }
  }, [id]);

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
        const idx = arr.indexOf(id);
        if (next && idx === -1) arr.push(id);
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

  if (loading) {
    return (
      <main className="pt-16 px-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="pt-16 px-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The project you are looking for does not exist."}
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "COMMERCIAL":
        return "bg-blue-100 text-blue-800";
      case "RETAIL_ONLY":
        return "bg-green-100 text-green-800";
      case "MIXED_USE":
        return "bg-purple-100 text-purple-800";
      case "RESIDENTIAL":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "HOLD":
        return "bg-yellow-100 text-yellow-800";
      case "SOLD":
        return "bg-red-100 text-red-800";
      case "LEASED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {/* Hero Section with Main Image */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8 ">
            <div className="relative h-[70vh] overflow-hidden max-w-7xl mx-auto rounded-3xl ">
              <img
                src={
                  (project.galleryImages &&
                    project.galleryImages[activeImageIndex]) ||
                  project.featuredImage
                }
                alt={project.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Action Buttons - Top Right */}
              <div className="absolute top-6 right-6 flex items-center space-x-3">
                <button
                  onClick={toggleLike}
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ShareIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* View All Photos Button - Bottom Right */}
              <button
                onClick={() => setViewAllPhotos(true)}
                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white transition-colors"
              >
                <PhotoIcon className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  View All Photos
                </span>
              </button>

              {/* Gallery Preview - Bottom Left */}
              {project.galleryImages.length > 0 && (
                <div className="absolute bottom-6 left-6 flex space-x-2">
                  {project.galleryImages.slice(0, 4).map((image, index) => (
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
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
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
                  {project.subtitle}
                </p>
              )}

              {/* Quick Info Tabs */}
              {/* <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                  onClick={() => scrollToSection(overviewRef, "overview")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection(unitsRef, "units")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "units"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Units
                </button>
                <button
                  onClick={() => scrollToSection(pricingRef, "pricing")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "pricing"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection(floorPlansRef, "floor-plans")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "floor-plans"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Floor Plans
                </button>
                <button
                  onClick={() => scrollToSection(amenitiesRef, "amenities")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "amenities"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Amenities
                </button>
                <button
                  onClick={() => scrollToSection(anchorsRef, "anchors")}
                  className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                    activeTab === "anchors"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Anchors
                </button>
                                 <button
                   onClick={() => scrollToSection(locationRef, "location")}
                   className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                     activeTab === "location"
                       ? "border-blue-500 text-blue-600"
                       : "border-transparent text-gray-500 hover:text-gray-700"
                   }`}
                 >
                   Location
                 </button>
                 <button
                   onClick={() => scrollToSection(videoRef, "videos")}
                   className={`py-3 px-1 border-b-2 font-medium whitespace-nowrap ${
                     activeTab === "videos"
                       ? "border-blue-500 text-blue-600"
                       : "border-transparent text-gray-500 hover:text-gray-700"
                   }`}
                 >
                   Videos
                 </button>
                 <button
                   onClick={() => setViewAllPhotos(true)}
                   className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
                 >
                   Gallery
                 </button>
              </div> */}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="text-center">
                  <HomeIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Area
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {project.units
                      .reduce((total, unit) => total + unit.areaSqFt, 0)
                      .toLocaleString()}{" "}
                    sq ft
                  </div>
                </div>
                <div className="text-center">
                  <CalendarIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    4/8/2025
                  </div>
                </div>
                <div className="text-center">
                  <EyeIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Views
                  </div>
                  <div className="font-semibold text-green-600">
                    116 this week
                  </div>
                </div>
              </div>
            </div>

            {/* Units Section */}
            <div
              ref={unitsRef}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Available Units
              </h2>
              {project.units.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Floor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {project.units.map((unit) => (
                        <tr
                          key={unit.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {unit.unitNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {unit.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {unit.floor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {unit.areaSqFt.toLocaleString()} sq ft
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {unit.priceTotal
                              ? `₹${(unit.priceTotal / 100000).toFixed(1)}L`
                              : unit.ratePsf
                              ? `₹${unit.ratePsf}/sq ft`
                              : "Price on Request"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                unit.availability === "AVAILABLE"
                                  ? "bg-green-100 text-green-800"
                                  : unit.availability === "HOLD"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : unit.availability === "SOLD"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {unit.availability}
              </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No units available
                </p>
              )}
            </div>

            {/* Pricing Section */}
            <div
              ref={pricingRef}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Pricing Table
              </h2>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {project.basePrice && (
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Starting Price
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {typeof project.basePrice === 'number' 
                        ? `₹${(project.basePrice / 100000).toFixed(1)}L`
                        : project.basePrice
                      }
                    </div>
                  </div>
                )}
                {project.priceRange && (
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Price Range
            </div>
                    <div className="text-2xl font-bold text-green-600">
                      {project.priceRange}
          </div>
          </div>
                )}
                {(project.minRatePsf || project.maxRatePsf) && (
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Rate per Sq Ft
        </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {project.minRatePsf && project.maxRatePsf 
                        ? `₹${project.minRatePsf} - ₹${project.maxRatePsf}`
                        : `₹${project.minRatePsf || project.maxRatePsf}`
                      }
                    </div>
                  </div>
                )}
      </div> */}

              {/* Pricing Table Section */}
              {project.pricingTable && project.pricingTable.length > 0 && (
                <div className="mb-8">
                  {/* <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Pricing Table
                  </h3> */}
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Area
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Price
                          </th>
                          {project.pricingTable.some(row => row.pricePerSqft) && (
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                              Price/Sq.ft
                            </th>
                          )}
                          {project.pricingTable.some(row => row.availableUnits) && (
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                              Available Units
                            </th>
                          )}
                          {project.pricingTable.some(row => row.floorNumbers) && (
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                              Floors
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {project.pricingTable.map((row, index) => (
                          <tr key={row.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              {row.type}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                              {row.reraArea}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                              {row.price}
                            </td>
                            {project.pricingTable.some(r => r.pricePerSqft) && (
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {row.pricePerSqft || '-'}
                              </td>
                            )}
                            {project.pricingTable.some(r => r.availableUnits) && (
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {row.availableUnits || '-'}
                              </td>
                            )}
                            {project.pricingTable.some(r => r.floorNumbers) && (
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                {row.floorNumbers || '-'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* {project.pricingPlans && project.pricingPlans.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Payment Plans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.pricingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {plan.name}
                        </h3>
                        <div className="text-sm text-blue-600 mb-3 capitalize">
                          {plan.planType.replace("_", " ")}
      </div>
                        {plan.notes && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {plan.notes}
                          </p>
                        )}

                        {plan.schedule && Array.isArray(plan.schedule) && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Payment Schedule:
                            </h4>
                            <ul className="space-y-1">
                              {plan.schedule.map((item: any, index: number) => (
                                <li
                key={index}
                                  className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                                >
                                  <span>{item.milestone || item.stage}</span>
                                  <span className="font-medium">
                                    {item.percent}%
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {plan.taxes && Array.isArray(plan.taxes) && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Taxes:
                            </h4>
                            <ul className="space-y-1">
                              {plan.taxes.map((tax: any, index: number) => (
                                <li
                                  key={index}
                                  className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                                >
                                  <span>{tax.name}</span>
                                  <span className="font-medium">
                                    {tax.percent}%
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Payment Plans
                  </h3>
                  <div className="text-center py-6">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Payment plan details will be available soon.
                    </p>
                  </div>
                </div>
              )} */}
            </div>

            {/* Floor Plans Section */}
          

            {/* Amenities Section */}
            {project.amenities.length > 0 && (
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
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
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
      )}

            {/* Anchor Tenants Section */}
            {project.anchors && project.anchors.length > 0 ? (
              <div
                ref={anchorsRef}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Anchor Tenants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.anchors.map((anchor) => (
                    <div
                      key={anchor.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        {anchor.icon && (
                          <span className="text-3xl">{anchor.icon}</span>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {anchor.name}
                          </h3>
                          <div className="text-sm text-blue-600 mb-2 capitalize">
                            {anchor.category}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {anchor.floor && (
                              <div>
                                Floor:{" "}
                                <span className="font-medium">
                                  {anchor.floor}
                                </span>
                              </div>
                            )}
                            {anchor.areaSqFt && (
                              <div>
                                Area:{" "}
                                <span className="font-medium">
                                  {anchor.areaSqFt.toLocaleString()} sq ft
                                </span>
                              </div>
                            )}
                            <div>
                              Status:{" "}
                              <span
                                className={`font-medium ${
                                  anchor.status === "CONFIRMED"
                                    ? "text-green-600"
                                    : anchor.status === "OPERATING"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {anchor.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                ref={anchorsRef}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Anchor Tenants
                </h2>
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Anchor tenant information will be updated soon.
                  </p>
                </div>
              </div>
            )}

            {/* Location & Nearby Points Section */}
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
                    {project.latitude && project.longitude && (
                      <div className="mt-3">
                        <a
                          href={`https://maps.google.com/?q=${project.latitude},${project.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View on Map
                        </a>
                      </div>
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
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    <img
                      src={project.sitePlanImage}
                      alt="Project Location Map"
                      className="w-full h-auto object-cover"
                      onError={(e) => { e.currentTarget.src = '/placeholder-map.jpg'; }}
                    />
                  </div>
                </div>
              )}

              {/* Nearby Points */}
              {/* {project.nearbyPoints && project.nearbyPoints.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Nearby Landmarks
                  </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.nearbyPoints.map((point) => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {point.name}
                </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {point.type.replace("_", " ")}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {point.distanceKm && (
                            <div className="font-medium text-blue-600">
                              {point.distanceKm} km
                            </div>
                          )}
                          {point.travelTimeMin && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {point.travelTimeMin} min
                            </div>
                          )}
                        </div>
              </div>
            ))}
          </div>
        </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Nearby Landmarks
                  </h3>
                  <div className="text-center py-6">
                    <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Nearby landmarks information will be updated soon.
                    </p>
                  </div>
                </div>
              )} */}
                         </div>

             {/* Floor Plans Section */}
             {project.floorPlans && project.floorPlans.length > 0 ? (
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
                           <img
                             src={plan.imageUrl}
                             alt={`${plan.level} floor plan`}
                             className="w-full h-full object-cover"
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
             ) : (
               <div
                 ref={floorPlansRef}
                 className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
               >
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                   Floor Plans
                 </h2>
                 <div className="text-center py-8">
                   <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                   <p className="text-gray-500 dark:text-gray-400">
                     Floor plans will be available soon.
                   </p>
                 </div>
               </div>
             )}

             {/* Videos Section */}
             <div
               ref={videoRef}
               className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
             >
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                 Property Videos
               </h2>
               
               {(project.videoUrl || (project.videoUrls && project.videoUrls.length > 0)) ? (
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
                           <div key={index} className="aspect-video relative rounded-lg overflow-hidden bg-black">
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
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {highlight.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          High-end amenities and premium finishes throughout
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About the Builder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                About the Builder
              </h2>
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {project.developerName
                      ? project.developerName.charAt(0)
                      : "D"}
                      </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.developerName || "Premium Development Group"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Award-winning luxury real estate developer with 25+ years of
                    experience in creating premium residential properties.
                  </p>
                  {project.reraId && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      RERA ID: {project.reraId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div
              ref={faqRef}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {(project.faqs && project.faqs.length > 0
                  ? project.faqs
                  : [
                      {
                        question: "What are the monthly maintenance fees?",
                        id: "faq1",
                        answer:
                          "Maintenance fees vary by unit size and amenities used.",
                      },
                      {
                        question: "Is parking included?",
                        id: "faq2",
                        answer:
                          "Yes, one parking space is included with each unit.",
                      },
                      {
                        question: "When is the move-in date?",
                        id: "faq3",
                        answer:
                          "Expected possession is as per the project timeline.",
                      },
                      {
                        question: "Are pets allowed?",
                        id: "faq4",
                        answer:
                          "Pet policy varies by project. Please check with our team.",
                      },
                    ]
                ).map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="text-left w-full font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors p-4 flex items-center justify-between"
                    >
                      <span>{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && faq.answer && (
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-600 pt-4 mt-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
          </div>
            </div>
          </div>

          {/* Right Column - Contact & Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
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
                        <div className="text-sm text-gray-500">Starting Price</div>
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
                        {/* <div className="text-xl font-bold text-gray-600 mb-1">
                        ₹{project.basePrice}
                        </div> */}
        </div>
      )}
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.units.length}
                      </div>
                      <div className="text-sm text-gray-500">Total Units</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {project.units.filter(unit => unit.availability === 'AVAILABLE').length}
                      </div>
                      <div className="text-sm text-gray-500">Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.units.reduce((total, unit) => total + unit.areaSqFt, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Area (sq ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {project.amenities.length}
                      </div>
                      <div className="text-sm text-gray-500">Amenities</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      project.status === 'READY' ? 'bg-green-100 text-green-800' :
                      project.status === 'UNDER_CONSTRUCTION' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Key Features */}
                  {project.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 3).map(highlight => (
                          <li key={highlight.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {highlight.label}
                          </li>
                        ))}
                        {project.highlights.length > 3 && (
                          <li className="text-sm text-blue-600 font-medium">
                            +{project.highlights.length - 3} more features
                          </li>
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
                  <button
                    onClick={() => setContactOpen(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">📞</span>
                    Contact Us
                  </button>
                  <button
                    onClick={() => setInfoOpen(true)}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">📧</span>
                    Request Info
                  </button>
                  <button
                    onClick={() => setTourOpen(true)}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">📅</span>
                    Schedule Tour
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full text-gray-600 dark:text-gray-400 py-2 flex items-center justify-center"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </button>
      </div>
              </div>

              {/* Property Details */}
              {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Property ID:
                    </span>
                    <span className="font-semibold text-blue-600">
                      BBE0996F
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Last Updated:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      4/8/2025
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Views:
                    </span>
                    <span className="font-semibold text-green-600">
                      116 this week
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Quick Facts */}
              {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Quick Facts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <HomeIcon className="w-5 h-5 text-blue-500" />
                    <div>
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

                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Area
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {project.units
                          .reduce((total, unit) => total + unit.areaSqFt, 0)
                          .toLocaleString()}{" "}
                        sq ft
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {project.city || "Metro City"}
                      </div>
                    </div>
                  </div>

                  {project.possessionDate && (
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Possession
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {new Date(
                            project.possessionDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {viewAllPhotos && project.galleryImages?.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
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
                <img
                  src={project.galleryImages[activeImageIndex]}
                  alt={`Photo ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex - 1 + project.galleryImages.length) %
                        project.galleryImages.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex + 1) % project.galleryImages.length
                    )
                  }
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
                      <img
                        src={img}
                        alt={`Thumb ${i + 1}`}
                        className="w-24 h-20 object-cover rounded-lg"
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
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {infoOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request Information
              </h3>
              <button
                onClick={() => setInfoOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleInfoSubmit} className="p-6 space-y-4">
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
              <textarea
                placeholder="What would you like to know?"
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-lg"
              >
                Request Info
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Tour Modal */}
      {tourOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule a Tour
              </h3>
              <button
                onClick={() => setTourOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTourSubmit} className="p-6 space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <input
                  required
                  type="time"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <textarea
                placeholder="Notes"
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg"
              >
                Schedule
              </button>
            </form>
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
