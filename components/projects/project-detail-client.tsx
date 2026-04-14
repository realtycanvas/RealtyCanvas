'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import FaqItem from './faq-item';
import { usePathname } from 'next/navigation';
import LeadModal from '../common/lead-modal';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import EnquirySection from '../home/enquiry-section';
import ViewAllLink from '../ui/view-all-link';

// ─── Types (unchanged) ─────────────────────────────────────────────────────────

type Highlight = { id: string; label: string; icon: string | null };
type Amenity = { id: string; category: string; name: string; details: string | null };
type FAQ = { id: string; question: string; answer: string | null; sortOrder?: number };
type FloorPlan = {
  id: string;
  level: string;
  title: string | null;
  imageUrl: string;
  details: string | null;
  sortOrder: number;
};
type PricingTableRow = {
  id: string;
  unitArea: string | null;
  type: string;
  reraArea: string;
  price: string;
  pricePerSqft: string | null;
  availabilityStatus: string | null;
  floorNumbers: string | null;
  features: unknown;
};
type NearbyPoint = { id: string; type: string; name: string; distanceKm: number | null; travelTimeMin: number | null };
type Offering = { id: string; icon: string | null; title: string; description: string; sortOrder: number };
type ProjectSeo = {
  h1Tag: string | null;
  h2Tags: string[];
  featuredImgAlt: string | null;
  imageAltMap: Record<string, string> | null;
  localHeading: string | null;
  localContent: string | null;
  longFormTitle: string | null;
  longFormContent: string | null;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  type: string | null;
  status: string;
  address: string;
  locality: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  featuredImage: string;
  galleryImages: string[];
  videoUrls: string[];
  basePrice: string | null;
  priceRange: string | null;
  priceMin: number | null;
  priceMax: number | null;
  bannerTitle: string | null;
  bannerSubtitle: string | null;
  bannerDescription: string | null;
  aboutTitle: string | null;
  aboutDescription: string | null;
  sitePlanTitle: string | null;
  sitePlanImage: string | null;
  sitePlanDescription: string | null;
  minRatePsf: string | null;
  maxRatePsf: string | null;
  totalUnits: number | null;
  soldUnits: number | null;
  availableUnits: number | null;
  landArea: string | null;
  numberOfTowers: number | null;
  numberOfFloors: number | null;
  numberOfApartments: number | null;
  reraId: string | null;
  developerName: string | null;
  highlights: Highlight[];
  amenities: Amenity[];
  faqs: FAQ[];
  floorPlans: FloorPlan[];
  pricingTable: PricingTableRow[];
  nearbyPoints: NearbyPoint[];
  offerings: Offering[];
  seo: ProjectSeo | null;
};

type RelatedProject = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  status: string;
  city: string | null;
  state: string | null;
  featuredImage: string;
  basePrice: string | null;
  priceRange: string | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatCategory = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const shortProjectTitle = (title: string) =>
  (title.split(/[–-]/)[0] || title).trim().replace(/\s+/g, ' ').split(' ').slice(0, 3).join(' ');

const getStatusStyle = (status: string) => {
  if (status === 'READY') return 'bg-green-100 text-green-800';
  if (status === 'UNDER_CONSTRUCTION') return 'bg-yellow-100 text-yellow-800';
  return 'bg-brand-primary text-black';
};

// Explicit locale prevents SSR hydration mismatch
const formatNumber = (value: number | null) => (value != null ? value.toLocaleString('en-IN') : null);

// ─── Section Wrapper — responsive padding & heading ────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white rounded p-4 sm:p-6 lg:p-8 shadow">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{title}</h2>
    {children}
  </section>
);

// ─── Video Helpers (unchanged) ─────────────────────────────────────────────────

const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/watch\?.*v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

const getYouTubeThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const isYouTubeUrl = (url: string) => getYouTubeId(url) !== null;

// ─── Video Player (unchanged) ──────────────────────────────────────────────────

const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean, origin?: string | null) => {
  const params = new URLSearchParams();
  params.set('rel', '0');
  if (autoplay) params.set('autoplay', '1');
  if (origin) params.set('origin', origin);
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

const VideoPlayer = ({
  url,
  autoplay = false,
  className = '',
  origin,
}: {
  url: string;
  autoplay?: boolean;
  className?: string;
  origin?: string | null;
}) => {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    const src = getYouTubeEmbedUrl(youtubeId, autoplay, origin);
    return (
      <iframe
        src={src}
        title="Project video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className={`w-full h-full border-0 ${className}`}
      />
    );
  }

  return (
    <video src={url} controls autoPlay={autoplay} className={`w-full h-full object-contain bg-black ${className}`}>
      Your browser does not support the video tag.
    </video>
  );
};

// ─── Video Thumbnail — responsive sizes ────────────────────────────────────────

const VideoThumbnail = ({
  url,
  index,
  isActive,
  onClick,
  size = 'sm',
}: {
  url: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
  size?: 'sm' | 'lg';
}) => {
  const youtubeId = getYouTubeId(url);
  // ✅ responsive size classes for both strip and modal filmstrip
  const sizeClass =
    size === 'lg' ? 'w-28 h-20 sm:w-36 sm:h-24 lg:w-40 lg:h-28' : 'w-16 h-12 sm:w-20 sm:h-14 md:w-28 md:h-20';

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded border-2 shrink-0 relative overflow-hidden ${
        isActive ? 'border-yellow-400' : 'border-white/60'
      } ${sizeClass}`}
    >
      {youtubeId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getYouTubeThumbnail(youtubeId)} alt={`Video ${index + 1}`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-xl">▶</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/80 flex items-center justify-center">
          <span className="text-gray-900 text-xs leading-none pl-0.5">▶</span>
        </div>
      </div>
    </button>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProjectDetailClient({
  project,
  relatedProjects,
}: {
  project: Project;
  relatedProjects: RelatedProject[];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewAllPhotos, setViewAllPhotos] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [viewAllVideos, setViewAllVideos] = useState(false);
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);
  const [viewAllFloorPlans, setViewAllFloorPlans] = useState(false);
  const [toast, setToast] = useState('');
  const { user } = useAuth();

  const pathname = usePathname();

  const projectPropertyType: 'COMMERCIAL' | 'RESIDENTIAL' | '' =
    project.category === 'RESIDENTIAL' ? 'RESIDENTIAL' : 'COMMERCIAL';

  const galleryImages = useMemo(() => {
    const images = project.galleryImages?.length ? project.galleryImages : [];
    if (project.featuredImage && !images.includes(project.featuredImage)) {
      return [project.featuredImage, ...images];
    }
    return images.length ? images : project.featuredImage ? [project.featuredImage] : [];
  }, [project.featuredImage, project.galleryImages]);

  const imageAltMap = project.seo?.imageAltMap ?? {};
  const defaultAlt = project.seo?.featuredImgAlt || project.title;
  const primaryHeading = project.seo?.h1Tag || project.title;
  const normalizeImageSrc = (src: string) => {
    const trimmed = src.trim();
    if (!trimmed) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;
    if (trimmed.startsWith('data:')) return trimmed;
    const cleaned = trimmed.replace(/[)\]]+$/, '');
    return cleaned;
  };
  const getImageAlt = (src: string) => imageAltMap[src] || imageAltMap[normalizeImageSrc(src)] || defaultAlt;
  const investTitle = shortProjectTitle(project.title);

  const amenityCategories = useMemo(
    () => Array.from(new Set(project.amenities.map((a) => a.category))),
    [project.amenities]
  );

  const leadFormDefaults = {
    propertyType: projectPropertyType,
    city: project.city || '',
    state: project.state || '',
    projectSlug: project.slug,
    projectTitle: project.title,
    sourcePath: pathname,
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };

  const youtubeOrigin = (() => {
    const raw = process.env.NEXT_PUBLIC_BASE_URL;
    if (!raw) return null;
    try {
      return new URL(raw).origin;
    } catch {
      return null;
    }
  })();

  const handleShare = async () => {
    const shareData = {
      title: project?.title ?? 'Project',
      text: project?.subtitle ?? 'Check out this project',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Share dialog opened');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard');
      }
    } catch {
      showToast('Unable to share');
    }
  };

  // ✅ extracted once to avoid duplication across mobile bar + sidebar
  const whatsappHref = `https://wa.me/919555562626?text=${encodeURIComponent(
    `Hi, I'm interested in *${project.title}*\n📍 ${[project.address, project.city].filter(Boolean).join(', ')}`
  )}`;

  const showRelatedCategory = project.category === 'COMMERCIAL' || project.category === 'RESIDENTIAL';
  const viewAllHref = showRelatedCategory ? `/projects?category=${encodeURIComponent(project.category)}` : '/projects';

  return (
    // ✅ pb-20 lg:pb-0 — clears the mobile floating CTA bar
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* ── Toast — ✅ was missing in original ───────────────────────────── */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-70 bg-gray-900 text-white px-4 py-2 rounded text-sm shadow-lg whitespace-nowrap pointer-events-none">
          {toast}
        </div>
      )}

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        projectTitle={project.title}
        defaultValues={leadFormDefaults}
      />

      {/* ✅ px-3 sm:px-4, py-4 sm:py-6 lg:py-8, mt-16 sm:mt-20 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8 mt-4 md:mt-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <Link href="/projects" className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base">
            ← Back to Projects
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-brand-primary hover:bg-brand-primary/80 text-white font-semibold text-sm sm:text-base"
            >
              Enquire Now
            </button>
            {user && (
              <Link
                href={`/admin/projects/create?slug=${project.slug}`}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm sm:text-base"
              >
                Edit Project
              </Link>
            )}
            <Link
              href="tel:9555562626"
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base"
            >
              Call Now
            </Link>
          </div>
        </div>

        {/* ✅ gap-4 sm:gap-6 lg:gap-8 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* ── Left Column ───────────────────────────────────────────────── */}
          {/* ✅ space-y-4 sm:space-y-6 lg:space-y-8 */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Gallery — ✅ height scales from 40vh on mobile to 60vh on desktop */}
            <div className="relative h-[40vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] rounded overflow-hidden">
              {galleryImages[activeImageIndex] && (
                <Image
                  src={normalizeImageSrc(galleryImages[activeImageIndex])}
                  alt={getImageAlt(galleryImages[activeImageIndex])}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              )}
              {/* Share button */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={handleShare}
                  className="cursor-pointer w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ClipboardDocumentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
              </div>
              <div className="absolute inset-0 bg-black/25" />

              {galleryImages.length > 1 && (
                <>
                  {/* ✅ View All: always visible (removed hidden md:block), compact on mobile */}
                  <button
                    onClick={() => setViewAllPhotos(true)}
                    className="cursor-pointer absolute bottom-3 sm:bottom-6 right-3 sm:right-6 bg-white hover:bg-gray-100 px-2 py-1 sm:px-4 sm:py-2 rounded text-gray-800 font-medium z-10 text-xs sm:text-sm"
                  >
                    View All
                  </button>

                  {/* ✅ Thumbnail strip: overflow-x-auto + max-w constraint so it never collides with button */}
                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-10 flex gap-1.5 sm:gap-2 max-w-[calc(100%-6rem)] sm:max-w-[calc(100%-10rem)] overflow-x-auto">
                    {galleryImages.slice(0, 5).map((img, index) => (
                      <button
                        key={img}
                        onClick={() => setActiveImageIndex(index)}
                        className={`cursor-pointer rounded border-2 shrink-0 ${
                          activeImageIndex === index ? 'border-yellow-400' : 'border-white/60'
                        }`}
                      >
                        <Image
                          src={normalizeImageSrc(img)}
                          alt={getImageAlt(img)}
                          width={64}
                          height={64}
                          // ✅ smaller on 320px, scales up with breakpoints
                          className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title + Address */}
            <div>
              {/* ✅ flex-wrap so RERA badges never overflow */}
              <div className="mb-2 flex flex-wrap gap-1.5 sm:gap-2">
                {project.reraId && (
                  <span className="inline-block text-[11px] sm:text-[12px] bg-green-100 font-semibold text-green-800 px-2 py-1 rounded">
                    RERA: RERA-APPROVED
                  </span>
                )}
                <span className="inline-block text-[11px] sm:text-[12px] bg-brand-primary/50 font-semibold px-2 py-1 rounded">
                  {formatCategory(project.status)}
                </span>
              </div>

              {/* ✅ h1 scales: 2xl → 3xl → 4xl */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{primaryHeading}</h1>

              {/* ✅ items-start on mobile prevents icon misalignment when address wraps */}
              <p className="text-gray-600 text-sm flex gap-1 items-start sm:items-center">
                <MapPin size={16} className="mt-0.5 sm:mt-px shrink-0" />
                <span>
                  {[project.address, project.locality, project.city, project.state].filter(Boolean).join(', ')}
                </span>
              </p>
            </div>

            {/* Short Description */}
            <div className="bg-white rounded p-4 sm:p-6 shadow">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {project.description}
              </p>
            </div>

            {/* 1. Project Overview */}
            {(project.aboutTitle || project.aboutDescription) && (
              <Section title={project.aboutTitle || 'Project Overview'}>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {project.aboutDescription}
                </p>
              </Section>
            )}

            {/* 2. Location Advantage */}
            {project.seo?.localContent && (
              <Section title={project.seo.localHeading || 'Location Advantage'}>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {project.seo.localContent}
                </p>
                {project.sitePlanImage && (
                  <div className="relative aspect-video rounded overflow-hidden mt-4 sm:mt-6">
                    <Image
                      src={normalizeImageSrc(project.sitePlanImage)}
                      alt={getImageAlt(project.sitePlanImage)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                  </div>
                )}
                {project.nearbyPoints.length > 0 && (
                  <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
                    {project.nearbyPoints.map((point) => (
                      <div
                        key={point.id}
                        className="flex justify-between text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium">{point.name}</span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {point.distanceKm ? `${point.distanceKm} km` : ''}
                          {point.travelTimeMin ? ` · ${point.travelTimeMin} min` : ''}
                          {!point.distanceKm && !point.travelTimeMin ? 'Nearby' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* 3. Retail, F&B & Commercial Spaces */}
            {project.offerings.length > 0 && (
              <Section title="Retail, F&B & Commercial Spaces">
                <div className="flex flex-col gap-6">
                  {project.offerings.map((offering) => (
                    <div
                      key={offering.id}
                      className="border border-gray-200 rounded p-4 sm:p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{offering.icon || '•'}</div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{offering.title}</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                        {offering.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 4. Price & Unit Size Overview */}
            {(project.basePrice || project.priceRange || project.priceMin || project.pricingTable.length > 0) && (
              <Section title="Price & Unit Size Overview">
                {(project.priceRange || project.basePrice) && (
                  <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {/* {project.priceRange && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded px-4 py-2.5 sm:px-5 sm:py-3 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Price Range</p>
                        <p className="text-base sm:text-lg font-bold text-yellow-700">{project.priceRange}</p>
                      </div>
                    )} */}
                    {project.basePrice && (
                      <div className="bg-gray-50 border border-gray-200 rounded px-4 py-2.5 sm:px-5 sm:py-3 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Base Price</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">{project.basePrice}</p>
                      </div>
                    )}
                    {/* {project.priceMin && project.priceMax && (
                      <div className="bg-gray-50 border border-gray-200 rounded px-4 py-2.5 sm:px-5 sm:py-3 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Pricing Band</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          ₹{formatNumber(project.priceMin)} – ₹{formatNumber(project.priceMax)}
                        </p>
                      </div>
                    )} */}
                  </div>
                )}

                {project.pricingTable.length > 0 && (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="min-w-120 px-4 sm:px-0">
                      {(() => {
                        const showUnitArea = project.pricingTable.some((row) => (row.unitArea || '').trim().length > 0);
                        const showReraArea = project.pricingTable.some((row) => (row.reraArea || '').trim().length > 0);
                        const showFloor = project.pricingTable.some(
                          (row) => (row.floorNumbers || '').trim().length > 0
                        );
                        const showPricePerSqft = project.pricingTable.some(
                          (row) => (row.pricePerSqft || '').trim().length > 0
                        );
                        const showStatus = project.pricingTable.some(
                          (row) => (row.availabilityStatus || '').trim().length > 0
                        );

                        return (
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 text-left text-gray-600">
                                {showUnitArea ? (
                                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">Unit</th>
                                ) : null}
                                <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                  Property Type
                                </th>
                                {showReraArea ? (
                                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                    Approx Unit Size
                                  </th>
                                ) : null}
                                {showFloor ? (
                                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                    Floor
                                  </th>
                                ) : null}
                                <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                  Indicative Price
                                </th>
                                {showPricePerSqft ? (
                                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                    Price / Sq.ft
                                  </th>
                                ) : null}
                                {showStatus ? (
                                  <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-semibold text-xs sm:text-sm">
                                    Status
                                  </th>
                                ) : null}
                              </tr>
                            </thead>
                            <tbody>
                              {project.pricingTable.map((row, idx) => (
                                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  {showUnitArea ? (
                                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                                      {row.unitArea || '—'}
                                    </td>
                                  ) : null}
                                  <td className="py-2.5 px-3 sm:py-3 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                                    {row.type}
                                  </td>
                                  {showReraArea ? (
                                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                                      {row.reraArea || '—'}
                                    </td>
                                  ) : null}
                                  {showFloor ? (
                                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-gray-700 text-xs sm:text-sm">
                                      {row.floorNumbers || '—'}
                                    </td>
                                  ) : null}
                                  <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-yellow-700 font-semibold text-xs sm:text-sm">
                                    {row.price}
                                  </td>
                                  {showPricePerSqft ? (
                                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                                      {row.pricePerSqft || '—'}
                                    </td>
                                  ) : null}
                                  {showStatus ? (
                                    <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-gray-600 text-xs sm:text-sm">
                                      {row.availabilityStatus === 'available'
                                        ? 'Available'
                                        : row.availabilityStatus === 'not-available'
                                          ? 'Not Available'
                                          : row.availabilityStatus || '—'}
                                    </td>
                                  ) : null}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 px-4 sm:px-0">
                      * Prices and sizes are indicative and subject to change at developer discretion.
                    </p>
                  </div>
                )}
              </Section>
            )}

            {/* 5. Amenities & Features */}
            {project.amenities.length > 0 && (
              <Section title="Amenities & Features">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {amenityCategories.map((category) => (
                    <div key={category} className="border border-gray-200 rounded p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">{category}</h3>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {project.amenities
                          .filter((a) => a.category === category)
                          .map((amenity) => (
                            <li key={amenity.id} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-yellow-500">•</span>
                              <span>{amenity.name}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 6. Why Invest */}
            {project.highlights.length > 0 && (
              <Section title={`Why Invest in ${investTitle}?`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {project.highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="flex items-start gap-3 p-3 sm:p-4 bg-yellow-50 border border-yellow-100 rounded"
                    >
                      <p className="leading-relaxed font-medium">{highlight.label}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 7. Who Should Consider */}
            {project.seo?.longFormContent && (
              <Section title={project.seo.longFormTitle || 'Who Should Consider?'}>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {project.seo.longFormContent}
                </p>
              </Section>
            )}

            {/* 8. Floor Plans */}
            {project.floorPlans.length > 0 && (
              <Section title="Floor Plans & Layouts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {project.floorPlans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setActiveFloorPlanIndex(index);
                        setViewAllFloorPlans(true);
                      }}
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={normalizeImageSrc(plan.imageUrl)}
                          alt={`${plan.level} floor plan`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                          {plan.level}
                          {plan.title ? ` • ${plan.title}` : ''}
                        </h3>
                        {plan.details && <p className="text-gray-600 text-sm mt-1">{plan.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 9. Project Videos */}
            {project.videoUrls.length > 0 && (
              <Section title="Project Videos">
                <div className="relative aspect-video rounded overflow-hidden bg-black">
                  <VideoPlayer url={project.videoUrls[activeVideoIndex]} origin={youtubeOrigin} />
                </div>

                {project.videoUrls.length > 1 && (
                  <div className="mt-3 sm:mt-4 flex items-end justify-between gap-3 sm:gap-4">
                    {/* ✅ overflow-x-auto + pb-1 so scrollbar doesn't clip thumbnails */}
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                      {project.videoUrls.slice(0, 4).map((url, index) => (
                        <VideoThumbnail
                          key={url}
                          url={url}
                          index={index}
                          isActive={activeVideoIndex === index}
                          onClick={() => setActiveVideoIndex(index)}
                        />
                      ))}
                    </div>
                    {project.videoUrls.length > 4 && (
                      <button
                        onClick={() => setViewAllVideos(true)}
                        className="cursor-pointer shrink-0 bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-gray-800 font-medium text-xs sm:text-sm"
                      >
                        All Videos ({project.videoUrls.length})
                      </button>
                    )}
                  </div>
                )}
              </Section>
            )}

            {/* 10. RERA Information */}
            {project.reraId && (
              <Section title="RERA Information">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">RERA ID:</span> {project.reraId}
                </p>
              </Section>
            )}

            {/* 11. FAQs */}
            {project.faqs.length > 0 && (
              <Section title="Frequently Asked Questions">
                <div className="space-y-2 sm:space-y-3">
                  {project.faqs.map((faq) => (
                    <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* ── Right Sticky Sidebar ───────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 lg:top-24 space-y-4 sm:space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded shadow overflow-hidden">
                <div className="text-center bg-gray-900 p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {project.basePrice || project.priceRange || 'Contact for Pricing'}
                  </div>
                  {project.developerName && (
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">by {project.developerName}</p>
                  )}
                </div>
                <div className="flex flex-wrap justify-around p-3 sm:p-4 gap-2 sm:gap-3">
                  {[
                    { label: 'Land Area', value: project.landArea },
                    { label: 'Towers', value: project.numberOfTowers },
                    { label: 'Apartments', value: project.numberOfApartments },
                    { label: 'Floors', value: project.numberOfFloors },
                    { label: 'Total Units', value: project.totalUnits },
                    { label: 'Type', value: project.type },
                    { label: 'Category', value: formatCategory(project.category) },
                  ]
                    .filter(({ value }) => value !== null && value !== undefined && value !== '')
                    .map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded p-2.5 sm:p-3 text-center min-w-18 sm:min-w-20">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{value}</p>
                        <p className="text-[11px] sm:text-xs text-gray-500">{label}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Key Highlights */}
              {project.highlights.length > 0 && (
                <div className="bg-white rounded p-4 sm:p-6 shadow">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">Key Highlights</h4>
                  <ul className="space-y-2">
                    {project.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight.id} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                        <span>{highlight.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ WhatsApp only on desktop — mobile uses floating CTA bar below */}
              <div className="hidden lg:block">
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition text-sm sm:text-base"
                >
                  WhatsApp Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <section className="my-12 md:my-16 lg:my-20">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Related Projects</h2>
              <ViewAllLink href={viewAllHref} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="bg-white rounded shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-44 bg-gray-200">
                    {item.featuredImage ? (
                      <Image
                        src={item.featuredImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : null}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className="px-3 py-1 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
                        {formatCategory(item.category)}
                      </span>
                      <span className={`px-3 py-1 rounded text-[10px] font-medium ${getStatusStyle(item.status)}`}>
                        {formatCategory(item.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    {item.subtitle ? <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.subtitle}</p> : null}
                    <div className="space-y-1 text-xs">
                      {(item.city || item.state) && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Location:</span>{' '}
                          {[item.city, item.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {(item.basePrice || item.priceRange) && (
                        <p className="text-yellow-600 font-semibold">
                          <span className="font-semibold">Base Price:</span> {item.basePrice || item.priceRange}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <EnquirySection />

      {/* ── Mobile Floating CTA Bar ─────────────────────────────────────────── */}
      {/* ✅ lg:hidden — replaces sidebar CTAs on mobile; safe-area-inset for iOS home bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex gap-2 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setIsLeadModalOpen(true)}
          className="flex-1 py-2.5 rounded bg-brand-primary text-white font-semibold text-sm text-center"
        >
          Enquire
        </button>
        <Link
          href="tel:9555562626"
          className="flex-1 py-2.5 rounded bg-green-600 text-white font-semibold text-sm text-center"
        >
          Call Now
        </Link>
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded bg-[#25D366] text-white font-semibold text-sm text-center"
        >
          WhatsApp
        </Link>
      </div>

      {/* ── Photo Gallery Modal — sheet-style on mobile, dialog on desktop ──── */}
      {viewAllPhotos && galleryImages.length > 0 && (
        // ✅ items-end on mobile = bottom sheet feel; sm:items-center = centered dialog
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded w-full sm:max-w-6xl h-[92vh] sm:h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Photos ({activeImageIndex + 1} / {galleryImages.length})
              </h3>
              <button
                onClick={() => setViewAllPhotos(false)}
                className="cursor-pointer px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
            <div className="flex-1 grid grid-rows-[1fr_auto] overflow-hidden">
              <div className="relative bg-black overflow-hidden">
                <Image
                  src={normalizeImageSrc(galleryImages[activeImageIndex])}
                  alt={getImageAlt(galleryImages[activeImageIndex])}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
                {/* ✅ smaller arrow buttons on mobile */}
                <button
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex - 1 + galleryImages.length) % galleryImages.length)
                  }
                  className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % galleryImages.length)}
                  className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold"
                >
                  ›
                </button>
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto bg-white border-t">
                <div className="flex gap-2 sm:gap-3">
                  {galleryImages.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => setActiveImageIndex(index)}
                      className={`cursor-pointer rounded border-2 shrink-0 ${
                        index === activeImageIndex ? 'border-yellow-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={normalizeImageSrc(img)}
                        alt={getImageAlt(img)}
                        width={96}
                        height={80}
                        // ✅ smaller filmstrip thumbnails on mobile
                        className="w-16 h-12 sm:w-24 sm:h-20 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Floor Plan Gallery Modal ─────────────────────────────────────── */}
      {viewAllFloorPlans && project.floorPlans.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded w-full sm:max-w-6xl h-[92vh] sm:h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Floor Plans ({activeFloorPlanIndex + 1} / {project.floorPlans.length})
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {project.floorPlans[activeFloorPlanIndex].level}
                  {project.floorPlans[activeFloorPlanIndex].title
                    ? ` • ${project.floorPlans[activeFloorPlanIndex].title}`
                    : ''}
                </p>
              </div>
              <button
                onClick={() => setViewAllFloorPlans(false)}
                className="cursor-pointer px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
            <div className="flex-1 grid grid-rows-[1fr_auto] overflow-hidden">
              <div className="relative bg-black overflow-hidden">
                <Image
                  src={normalizeImageSrc(project.floorPlans[activeFloorPlanIndex].imageUrl)}
                  alt={`${project.floorPlans[activeFloorPlanIndex].level} floor plan`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
                {project.floorPlans.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveFloorPlanIndex(
                          (activeFloorPlanIndex - 1 + project.floorPlans.length) % project.floorPlans.length
                        )
                      }
                      className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setActiveFloorPlanIndex((activeFloorPlanIndex + 1) % project.floorPlans.length)
                      }
                      className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto bg-white border-t">
                <div className="flex gap-2 sm:gap-3">
                  {project.floorPlans.map((plan, index) => (
                    <button
                      key={plan.id}
                      onClick={() => setActiveFloorPlanIndex(index)}
                      className={`cursor-pointer rounded border-2 shrink-0 ${
                        index === activeFloorPlanIndex ? 'border-yellow-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={normalizeImageSrc(plan.imageUrl)}
                        alt={`${plan.level} floor plan`}
                        width={96}
                        height={80}
                        className="w-16 h-12 sm:w-24 sm:h-20 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Gallery Modal — same sheet/dialog pattern ─────────────────── */}
      {viewAllVideos && project.videoUrls.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded w-full sm:max-w-6xl h-[92vh] sm:h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Videos ({activeVideoIndex + 1} / {project.videoUrls.length})
              </h3>
              <button
                onClick={() => setViewAllVideos(false)}
                className="cursor-pointer px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>

            <div className="flex-1 grid grid-rows-[1fr_auto] overflow-hidden">
              <div className="relative bg-black overflow-hidden">
                <VideoPlayer url={project.videoUrls[activeVideoIndex]} autoplay origin={youtubeOrigin} />
                {project.videoUrls.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveVideoIndex(
                          (activeVideoIndex - 1 + project.videoUrls.length) % project.videoUrls.length
                        )
                      }
                      className="cursor-pointer absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold z-10"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setActiveVideoIndex((activeVideoIndex + 1) % project.videoUrls.length)}
                      className="cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold z-10"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto bg-white border-t">
                <div className="flex gap-2 sm:gap-3">
                  {project.videoUrls.map((url, index) => (
                    <VideoThumbnail
                      key={url}
                      url={url}
                      index={index}
                      isActive={index === activeVideoIndex}
                      onClick={() => setActiveVideoIndex(index)}
                      size="lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
