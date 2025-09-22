import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from '@/lib/prisma';
import ProjectDetailClient from '@/app/projects/[id]/ProjectDetailClient';

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
  
  try {
    const project = await getProjectData(id);
    
    if (!project) {
      return {
        title: 'Project Not Found - Realty Canvas',
        description: 'The requested project could not be found.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
    const projectUrl = `${baseUrl}/projects/${project.slug}`;
    
    return {
      title: `${project.title} - Realty Canvas`,
      description: project.description || `${project.title} - Premium ${project.category.toLowerCase()} project in ${project.city || project.address}`,
      openGraph: {
        title: `${project.title} - Realty Canvas`,
        description: project.description || `${project.title} - Premium ${project.category.toLowerCase()} project in ${project.city || project.address}`,
        url: projectUrl,
        siteName: 'Realty Canvas',
        images: [
          {
            url: project.featuredImage,
            width: 1200,
            height: 630,
            alt: `${project.title} - Featured Image`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${project.title} - Realty Canvas`,
        description: project.description || `${project.title} - Premium ${project.category.toLowerCase()} project in ${project.city || project.address}`,
        images: [project.featuredImage],
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
};

// Server component that fetches data and renders the client component
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  
  // Fetch project data on the server
  const project = await getProjectData(slug);
  
  if (!project) {
    notFound();
  }
  
  return <ProjectDetailClient project={project} slug={slug} />;
}

// Server-side data fetching function with optimized queries
async function getProjectData(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        status: true,
        address: true,
        city: true,
        state: true,
        featuredImage: true,
        galleryImages: true,
        reraId: true,
        developerName: true,
        possessionDate: true,
        basePrice: true,
        priceRange: true,
        minRatePsf: true,
        maxRatePsf: true,
        latitude: true,
        longitude: true,
        sitePlanImage: true,
        videoUrl: true,
        videoUrls: true,
        landArea: true,
        numberOfTowers: true,
        numberOfApartments: true,
        numberOfFloors: true,
        features: true,
        createdAt: true,
        updatedAt: true,
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
            notes: true
          },
          orderBy: [
            { floor: 'asc' },
            { unitNumber: 'asc' }
          ],
        },
        highlights: {
          select: {
            id: true,
            label: true,
            icon: true
          },
          orderBy: { id: 'asc' }
        },
        amenities: {
          select: {
            id: true,
            category: true,
            name: true,
            details: true
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }]
        },
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true
          },
          orderBy: { id: 'asc' }
        },
        floorPlans: {
          select: {
            id: true,
            level: true,
            title: true,
            imageUrl: true,
            details: true,
            sortOrder: true
          },
          orderBy: [{ sortOrder: 'asc' }, { level: 'asc' }]
        },
        anchors: {
          select: {
            id: true,
            name: true,
            category: true,
            floor: true,
            areaSqFt: true,
            status: true
          },
          orderBy: [{ status: 'asc' }, { name: 'asc' }]
        },
        pricingPlans: {
          select: {
            id: true,
            name: true,
            planType: true,
            schedule: true,
            taxes: true,
            charges: true,
            notes: true
          },
          orderBy: { id: 'asc' }
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
            features: true
          },
          orderBy: { id: 'asc' }
        },
        nearbyPoints: {
          select: {
            id: true,
            type: true,
            name: true,
            distanceKm: true,
            travelTimeMin: true
          },
          orderBy: [{ type: 'asc' }, { distanceKm: 'asc' }]
        }
      },
    });
    
    // Convert Date and string fields for client component compatibility
    if (project) {
      return {
        ...project,
        possessionDate: project.possessionDate ? project.possessionDate.toISOString() : null,
        units: project.units.map(unit => ({
          ...unit,
          areaSqFt: typeof unit.areaSqFt === 'string' ? parseFloat(unit.areaSqFt) : unit.areaSqFt
        })),
        anchors: project.anchors.map(anchor => ({
          ...anchor,
          areaSqFt: anchor.areaSqFt ? (typeof anchor.areaSqFt === 'string' ? parseFloat(anchor.areaSqFt) : anchor.areaSqFt) : null
        }))
      };
    }
    
    return project;
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

// Enable static generation with revalidation
export const dynamic = 'force-dynamic'; // Force dynamic rendering for fresh data
export const revalidate = 0; // Disable caching for immediate updates