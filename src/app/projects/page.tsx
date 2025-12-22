import { Suspense } from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import ProjectListingClient, { Project, Pagination } from './ProjectListingClient';

export const metadata: Metadata = {
  title: 'Premium Real Estate Projects – Residential & Commercial | Realty Canvas',
  description: 'Explore premium residential and commercial real estate projects across Gurgaon & beyond with Realty Canvas. Discover verified listings, top locations, and expert property assistance for buyers and investors.',
  alternates: {
    canonical: 'https://www.realtycanvas.in/projects',
  },
};

export const dynamic = 'force-dynamic';

// Cached fetcher for initial load (no filters)
const getCachedInitialProjects = unstable_cache(
  async (limit: number = 6) => {
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          category: true,
          status: true,
          address: true,
          city: true,
          state: true,
          featuredImage: true,
          createdAt: true,
          basePrice: true,
          minRatePsf: true,
          maxRatePsf: true,
          developerName: true,
          locality: true,
        },
      }),
      prisma.project.count(),
    ]);
    return { projects, totalCount };
  },
  ['projects-initial-list'],
  { revalidate: 60, tags: ['projects'] }
);

async function getProjects(searchParams: { [key: string]: string | string[] | undefined }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 6;
  const skip = (page - 1) * limit;

  // Build filter conditions based on search params
  const where: any = {};
  let hasFilters = false;

  if (typeof searchParams.search === 'string' && searchParams.search.trim()) {
    where.OR = [
      { title: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { address: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { city: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { developerName: { contains: searchParams.search.trim(), mode: 'insensitive' } },
    ];
    hasFilters = true;
  }

  if (typeof searchParams.category === 'string' && searchParams.category !== 'ALL') {
    where.category = searchParams.category;
    hasFilters = true;
  }

  if (typeof searchParams.status === 'string' && searchParams.status !== 'ALL') {
    where.status = searchParams.status;
    hasFilters = true;
  }

  if (typeof searchParams.city === 'string' && searchParams.city.trim()) {
    where.city = { contains: searchParams.city.trim(), mode: 'insensitive' };
    hasFilters = true;
  }

  if (typeof searchParams.state === 'string' && searchParams.state.trim()) {
    where.state = { contains: searchParams.state.trim(), mode: 'insensitive' };
    hasFilters = true;
  }

  try {
    let projects: any[];
    let totalCount: number;

    // Use cached version for initial load (page 1, no filters)
    if (!hasFilters && page === 1 && limit === 6) {
      const cached = await getCachedInitialProjects(limit);
      projects = cached.projects;
      totalCount = cached.totalCount;
    } else {
      // Direct DB call for filtered/paginated views
      [projects, totalCount] = await Promise.all([
        prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            slug: true,
            title: true,
            subtitle: true,
            category: true,
            status: true,
            address: true,
            city: true,
            state: true,
            featuredImage: true,
            createdAt: true,
            basePrice: true,
            minRatePsf: true,
            maxRatePsf: true,
            developerName: true,
            locality: true,
          },
        }),
        prisma.project.count({ where }),
      ]);
    }

    const formattedProjects: Project[] = projects.map(p => ({
      ...p,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : new Date(p.createdAt).toISOString(),
      basePrice: p.basePrice ? String(p.basePrice) : null, // Ensure string if DB has string/number
      minRatePsf: p.minRatePsf ? String(p.minRatePsf) : null,
      maxRatePsf: p.maxRatePsf ? String(p.maxRatePsf) : null,
      category: p.category as any, // Cast to union type
      status: p.status as any,
    }));

    return {
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
        hasPrevious: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching projects server-side:', error);
    return {
      projects: [],
      pagination: {
        page: 1,
        limit: 6,
        totalCount: 0,
        totalPages: 0,
        hasMore: false,
        hasPrevious: false
      }
    }
  }
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const { projects, pagination } = await getProjects(resolvedSearchParams);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Realty Canvas Projects",
    "description": "A curated list of premium residential and commercial real estate projects available through Realty Canvas, including under construction and ready-to-move options.",
    "url": `${baseUrl}/projects`,
    "publisher": {
      "@type": "Organization",
      "name": "Realty Canvas",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+919910007801",
        "contactType": "customer service",
        "areaServed": "IN"
      }
    },
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": project.title,
      "url": `${baseUrl}/projects/${project.slug}`
    }))
  };

  return (
    <>
      <Script
        id="projects-itemlist-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />

      <Script
        id="projects-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/projects` }
            ]
          })
        }}
      />

      <ProjectListingClient initialProjects={projects} initialPagination={pagination} />
    </>
  );
}
