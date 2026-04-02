import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/projects/project-detail-client';
import JsonLd from '@/components/common/JsonLd';
import Breadcrumb from '@/components/ui/breadcrumb';
import { prisma } from '@/lib/prisma';
import { ProjectCategory } from '@/app/generated/prisma/client';

type Highlight = {
  id: string;
  label: string;
  icon: string | null;
};

type Amenity = {
  id: string;
  category: string;
  name: string;
  details: string | null;
};

type Faq = {
  id: string;
  question: string;
  answer: string | null;
};

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

type NearbyPoint = {
  id: string;
  type: string;
  name: string;
  distanceKm: number | null;
  travelTimeMin: number | null;
};

type Offering = {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  sortOrder: number;
};

type ProjectSeo = {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string;
  schemaMarkup: unknown;
  h1Tag: string | null;
  h2Tags: string[];
  featuredImgAlt: string | null;
  imageAltMap: Record<string, string> | null;
  localHeading: string | null;
  localContent: string | null;
  longFormTitle: string | null;
  longFormContent: string | null;
  isIndexable: boolean;
  sitemapPriority: number;
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
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  createdAt: string;
  highlights: Highlight[];
  amenities: Amenity[];
  faqs: Faq[];
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

const normalizeImageAltMap = (value: unknown): Record<string, string> | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }
  return value as Record<string, string>;
};

async function getRelatedProjects(category: string, slug: string): Promise<RelatedProject[]> {
  const related = await prisma.project.findMany({
    where: { isActive: true, category: category as ProjectCategory, slug: { not: slug } },
    take: 3,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      category: true,
      status: true,
      city: true,
      state: true,
      featuredImage: true,
      basePrice: true,
      priceRange: true,
    },
  });

  return related.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? null,
    category: p.category,
    status: p.status,
    city: p.city ?? null,
    state: p.state ?? null,
    featuredImage: p.featuredImage,
    basePrice: p.basePrice ?? null,
    priceRange: p.priceRange ?? null,
  }));
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: { slug, isActive: true },
    include: {
      amenities: { orderBy: { sortOrder: 'asc' } },
      highlights: { orderBy: { sortOrder: 'asc' } },
      faqs: { orderBy: { sortOrder: 'asc' } },
      floorPlans: { orderBy: [{ sortOrder: 'asc' }, { level: 'asc' }] },
      pricingTable: { orderBy: { id: 'asc' } },
      nearbyPoints: { orderBy: [{ type: 'asc' }, { distanceKm: 'asc' }] },
      offerings: { orderBy: { sortOrder: 'asc' } },
      seo: true,
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle ?? null,
    description: project.description,
    category: project.category,
    type: project.type ?? null,
    status: project.status,
    address: project.address,
    locality: project.locality ?? null,
    city: project.city ?? null,
    state: project.state ?? null,
    latitude: project.latitude ?? null,
    longitude: project.longitude ?? null,
    featuredImage: project.featuredImage,
    galleryImages: project.galleryImages ?? [],
    videoUrls: project.videoUrls ?? [],
    basePrice: project.basePrice ?? null,
    priceRange: project.priceRange ?? null,
    priceMin: project.priceMin ?? null,
    priceMax: project.priceMax ?? null,
    bannerTitle: project.bannerTitle ?? null,
    bannerSubtitle: project.bannerSubtitle ?? null,
    bannerDescription: project.bannerDescription ?? null,
    aboutTitle: project.aboutTitle ?? null,
    aboutDescription: project.aboutDescription ?? null,
    sitePlanTitle: project.sitePlanTitle ?? null,
    sitePlanImage: project.sitePlanImage ?? null,
    sitePlanDescription: project.sitePlanDescription ?? null,
    minRatePsf: project.minRatePsf ?? null,
    maxRatePsf: project.maxRatePsf ?? null,
    totalUnits: project.totalUnits ?? null,
    soldUnits: project.soldUnits ?? null,
    availableUnits: project.availableUnits ?? null,
    landArea: project.landArea ?? null,
    numberOfTowers: project.numberOfTowers ?? null,
    numberOfFloors: project.numberOfFloors ?? null,
    numberOfApartments: project.numberOfApartments ?? null,
    reraId: project.reraId ?? null,
    developerName: project.developerName ?? null,
    seoTitle: project.seoTitle ?? null,
    seoDescription: project.seoDescription ?? null,
    seoKeywords: project.seoKeywords ?? [],
    createdAt: project.createdAt.toISOString(),
    highlights: project.highlights ?? [],
    amenities: project.amenities ?? [],
    faqs: project.faqs ?? [],
    floorPlans:
      project.floorPlans?.map((plan) => ({
        ...plan,
        details: typeof plan.details === 'string' ? plan.details : plan.details ? JSON.stringify(plan.details) : null,
      })) ?? [],
    pricingTable: project.pricingTable ?? [],
    nearbyPoints: project.nearbyPoints ?? [],
    offerings: project.offerings ?? [],
    seo: project.seo
      ? {
          metaTitle: project.seo.metaTitle ?? null,
          metaDescription: project.seo.metaDescription ?? null,
          metaKeywords: project.seo.metaKeywords ?? [],
          canonicalUrl: project.seo.canonicalUrl ?? null,
          ogTitle: project.seo.ogTitle ?? null,
          ogDescription: project.seo.ogDescription ?? null,
          ogImage: project.seo.ogImage ?? null,
          twitterCard: project.seo.twitterCard,
          schemaMarkup: project.seo.schemaMarkup ?? null,
          h1Tag: project.seo.h1Tag ?? null,
          h2Tags: project.seo.h2Tags ?? [],
          featuredImgAlt: project.seo.featuredImgAlt ?? null,
          imageAltMap: normalizeImageAltMap(project.seo.imageAltMap),
          localHeading: project.seo.localHeading ?? null,
          localContent: project.seo.localContent ?? null,
          longFormTitle: project.seo.longFormTitle ?? null,
          longFormContent: project.seo.longFormContent ?? null,
          isIndexable: project.seo.isIndexable,
          sitemapPriority: project.seo.sitemapPriority,
        }
      : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw).toLowerCase().trim();
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Details - RealtyCanvas',
      description: 'Explore premium real estate project details and information',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const projectUrl = project.seo?.canonicalUrl || `${baseUrl}/projects/${project.slug}`;

  const title =
    project.seo?.metaTitle ||
    project.seoTitle ||
    `${project.title} | ${project.locality || project.city || 'Gurugram'} | RealtyCanvas`;

  const description = project.seo?.metaDescription || project.seoDescription || project.description;

  const keywords = project.seo?.metaKeywords?.length
    ? project.seo.metaKeywords
    : project.seoKeywords?.length
      ? project.seoKeywords
      : [project.title, project.developerName || '', project.city || '', project.category, 'real estate']
          .filter(Boolean)
          .map((k) => k.toString());

  const ogImage =
    project.seo?.ogImage ||
    (project.featuredImage?.startsWith('http')
      ? project.featuredImage
      : `${baseUrl}${project.featuredImage?.startsWith('/') ? project.featuredImage : `/${project.featuredImage}`}`);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: projectUrl },
    openGraph: {
      title,
      description,
      url: projectUrl,
      siteName: 'RealtyCanvas',
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
      card: (project.seo?.twitterCard || 'summary_large_image') as 'summary' | 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: project.seo?.isIndexable === false ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw).toLowerCase().trim();
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project.category, project.slug);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const projectUrl = `${baseUrl}/projects/${project.slug}`;

  const realEstateLd = project.seo?.schemaMarkup || {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.title,
    description: project.seo?.metaDescription || project.seoDescription || project.description,
    image: project.featuredImage?.startsWith('http')
      ? project.featuredImage
      : `${baseUrl}${project.featuredImage?.startsWith('/') ? project.featuredImage : `/${project.featuredImage}`}`,
    url: projectUrl,
    datePosted: project.createdAt,
    about: {
      '@type': 'Place',
      name: project.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: project.address,
        addressLocality: project.locality || project.city,
        addressRegion: project.state,
        addressCountry: 'IN',
      },
      geo:
        project.latitude && project.longitude
          ? { '@type': 'GeoCoordinates', latitude: project.latitude, longitude: project.longitude }
          : undefined,
    },
    provider: {
      '@type': 'RealEstateAgent',
      name: 'RealtyCanvas',
      url: baseUrl,
      '@id': `${baseUrl}/#organization`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${baseUrl}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: projectUrl },
    ],
  };

  const faqLd =
    project.faqs && project.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: project.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer || '',
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <Breadcrumb items={[{ label: 'Projects', href: '/projects' }, { label: project.title }]} />
      <JsonLd data={realEstateLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
    </main>
  );
}
