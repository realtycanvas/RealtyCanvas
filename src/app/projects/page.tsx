import { Suspense } from 'react';
import { Metadata } from 'next';
import JsonLd from '@/components/SEO/JsonLd';
import { prisma } from '@/lib/prisma';
import ProjectListingClient, { Project, Pagination } from './ProjectListingClient';

export const metadata: Metadata = {
  title: 'All Projects | Realty Canvas',
  description: 'Explore our wide range of commercial and residential projects in Gurgaon.',
  alternates: {
    canonical: 'https://www.realtycanvas.in/projects',
  },
};

export const revalidate = 60; // Revalidate every minute

async function getProjects(searchParams: { [key: string]: string | string[] | undefined }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 6;
  const skip = (page - 1) * limit;

  // Build filter conditions based on search params
  const where: any = {};

  if (typeof searchParams.search === 'string' && searchParams.search.trim()) {
    where.OR = [
      { title: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { address: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { city: { contains: searchParams.search.trim(), mode: 'insensitive' } },
      { developerName: { contains: searchParams.search.trim(), mode: 'insensitive' } },
    ];
  }

  if (typeof searchParams.category === 'string' && searchParams.category !== 'ALL') {
    where.category = searchParams.category;
  }

  if (typeof searchParams.status === 'string' && searchParams.status !== 'ALL') {
    where.status = searchParams.status;
  }

  if (typeof searchParams.city === 'string' && searchParams.city.trim()) {
    where.city = { contains: searchParams.city.trim(), mode: 'insensitive' };
  }

  if (typeof searchParams.state === 'string' && searchParams.state.trim()) {
    where.state = { contains: searchParams.state.trim(), mode: 'insensitive' };
  }

  // Price range logic (simplified for Prisma - exact implementation depends on schema and type)
  // Assuming minRatePsf/maxRatePsf are stored as strings or numbers. 
  // For simplicity in this SSR fetch, we might skip complex price filtering or do basic implementation.
  // The client side does full API fetch which handles all filters.
  // We will prioritize content serving here.

  // Note: For SSR efficiency, you might want to only apply basic filters here 
  // or duplicate the exact API logic. For now, basic fetching ensures content is present.

  try {
    const [projects, totalCount] = await Promise.all([
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

    const formattedProjects: Project[] = projects.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
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

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "url": `${baseUrl}/projects`,
        "name": "Projects",
        "isPartOf": { "@type": "WebSite", "url": baseUrl }
      }} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/projects` }
        ]
      }} />

      <ProjectListingClient initialProjects={projects} initialPagination={pagination} />
    </>
  );
}
