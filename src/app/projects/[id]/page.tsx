import { notFound } from "next/navigation";
import { Metadata } from "next";
import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withWarmCache } from '@/lib/warm-cache-helper';
import ProjectDetailClient from '@/app/projects/[id]/ProjectDetailClient';

// Revalidate project detail pages every 5 minutes (ISR)
export const revalidate = 300;

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

// Generate dynamic metadata for Open Graph sharing
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const slug = decodeURIComponent(id).trim().toLowerCase();
  
  try {
    const project = await withWarmCache<Project>(slug, () => getProjectData(slug), { logLabel: 'metadata' });
    
    if (!project) {
      // Minimal metadata to avoid broken head during transient failures
      return {
        title: 'Project',
        description: 'Project details',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
    const projectUrl = `${baseUrl}/projects/${project.slug}`;

    // Prefer per-project SEO overrides with sensible fallbacks
    const title =
      (project as any).seoTitle ||
      `${project.title} | ${(project as any).locality || project.city || 'Gurgaon'} | Realty Canvas`;

    const description =
      (project as any).seoDescription ||
      (project.description ||
        `${project.title} - ${project.category} project by ${project.developerName || 'Leading Developer'} in ${(project as any).locality || project.city || 'Gurgaon'}. ${project.priceRange ? `Prices starting from ${project.priceRange}.` : ''} Contact Realty Canvas for site visit and best offers.`);

    const keywordsArr: string[] =
      (project as any).seoKeywords && (project as any).seoKeywords.length
        ? (project as any).seoKeywords
        : [
            project.title,
            project.developerName || '',
            (project as any).locality || '',
            project.city || '',
            project.category.toLowerCase(),
            'property',
            'real estate',
            'gurgaon',
            'delhi ncr',
          ].filter(Boolean);

    // Ensure absolute OG/Twitter image URLs
    const ogImage =
      project.featuredImage?.startsWith('http')
        ? project.featuredImage
        : `${baseUrl}${project.featuredImage?.startsWith('/') ? project.featuredImage : `/${project.featuredImage}`}`;

    return {
      title,
      description,
      keywords: keywordsArr,
      alternates: { canonical: projectUrl },
      openGraph: {
        title,
        description,
        url: projectUrl,
        siteName: 'Realty Canvas',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Realty Canvas - Real Estate Listings',
      description: 'Find your dream property with Realty Canvas',
    };
  }
}

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
  locality?: string | null;
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
  // Commercial project specific fields
  landArea?: string | null;
  numberOfTowers?: number | null;
  numberOfApartments?: number | null;
  numberOfFloors?: number | null;
  features?: string | null;
  // Optional SEO overrides used in metadata
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
};

// Server component that fetches data and renders the client component
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const slug = decodeURIComponent(raw).trim().toLowerCase();

  const project = await withWarmCache<Project>(slug, () => getProjectData(slug), { logLabel: 'page' });

  if (!project) {
    notFound();
  }
  
  return <ProjectDetailClient project={project} slug={slug} />;
}

// Server-side data fetching function with optimized queries
async function getProjectData(slug: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        units: {
          select: {
            id: true,
            unitNumber: true,
            type: true,
            floor: true,
            areaSqFt: true,
            ratePsf: true,
            priceTotal: true,
            availability: true,
            notes: true,
          },
          orderBy: [{ floor: 'asc' }, { unitNumber: 'asc' }],
        },
        highlights: {
          select: { id: true, label: true, icon: true },
          orderBy: { id: 'asc' },
        },
        amenities: {
          select: { id: true, category: true, name: true, details: true },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
        },
        faqs: {
          select: { id: true, question: true, answer: true },
          orderBy: { id: 'asc' },
        },
        floorPlans: {
          select: {
            id: true,
            level: true,
            title: true,
            imageUrl: true,
            details: true,
            sortOrder: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { level: 'asc' }],
        },
        anchors: {
          select: {
            id: true,
            name: true,
            category: true,
            floor: true,
            areaSqFt: true,
            status: true,
          },
          orderBy: [{ status: 'asc' }, { name: 'asc' }],
        },
        pricingPlans: {
          select: {
            id: true,
            name: true,
            planType: true,
            schedule: true,
            taxes: true,
            charges: true,
            notes: true,
          },
          orderBy: { id: 'asc' },
        },
        pricingTable: {
          select: {
            id: true,
            type: true,
            reraArea: true,
            price: true,
            pricePerSqft: true,
            availableUnits: true,
            floorNumbers: true,
            features: true,
          },
          orderBy: { id: 'asc' },
        },
        nearbyPoints: {
          select: {
            id: true,
            type: true,
            name: true,
            distanceKm: true,
            travelTimeMin: true,
          },
          orderBy: [{ type: 'asc' }, { distanceKm: 'asc' }],
        },
      },
    });
    
    // Convert Date and string fields for client component compatibility
    if (!project) return null;

    const normalized: Project = {
      id: project.id,
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle ?? null,
      description: project.description,
      category: project.category as any,
      status: project.status as any,
      address: project.address,
      locality: (project as any).locality ?? null,
      city: project.city ?? null,
      state: project.state ?? null,
      featuredImage: project.featuredImage,
      galleryImages: project.galleryImages ?? [],
      reraId: project.reraId ?? null,
      developerName: project.developerName ?? null,
      possessionDate: project.possessionDate ? project.possessionDate.toISOString() : null,
      basePrice: (project as any).basePrice ?? null,
      priceRange: project.priceRange ?? null,
      minRatePsf: (project as any).minRatePsf ?? null,
      maxRatePsf: (project as any).maxRatePsf ?? null,
      latitude: project.latitude ?? null,
      longitude: project.longitude ?? null,
      sitePlanImage: project.sitePlanImage ?? null,
      units: (project.units ?? []).map((unit: any) => ({
        ...unit,
        areaSqFt: typeof unit.areaSqFt === 'string' ? parseFloat(unit.areaSqFt) : unit.areaSqFt,
      })),
      highlights: project.highlights ?? [],
      amenities: project.amenities ?? [],
      anchors: (project.anchors ?? []).map((anchor: any) => ({
        ...anchor,
        areaSqFt: anchor.areaSqFt ? (typeof anchor.areaSqFt === 'string' ? parseFloat(anchor.areaSqFt) : anchor.areaSqFt) : null,
      })),
      floorPlans: project.floorPlans ?? [],
      pricingPlans: project.pricingPlans ?? [],
      pricingTable: project.pricingTable ?? [],
      faqs: project.faqs ?? [],
      nearbyPoints: project.nearbyPoints ?? [],
      videoUrl: project.videoUrl ?? null,
      videoUrls: project.videoUrls ?? [],
      landArea: project.landArea ?? null,
      numberOfTowers: project.numberOfTowers ?? null,
      numberOfApartments: project.numberOfApartments ?? null,
      numberOfFloors: (project as any).numberOfFloors ?? null,
      features: project.features ?? null,
      seoTitle: (project as any).seoTitle ?? null,
      seoDescription: (project as any).seoDescription ?? null,
      seoKeywords: (project as any).seoKeywords ?? [],
    };

    return normalized;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Generate static params for static generation with ISR
export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        slug: true,
      },
      take: 50, // Limit for initial build - most important projects
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return projects.map((project) => ({
      id: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enable static generation with ISR (revalidate is set at the top of the file)