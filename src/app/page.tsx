import type { Metadata } from 'next';
import { prisma, ensureDatabaseConnection } from '@/lib/prisma';
import { FeaturedDiagnostics } from '@/components/homepage';
import { AdminFallbackBanner } from '@/components/homepage';
// Homepage Components
import {
  HeroSection,
  PropertySearchSection,
  BenefitsSection,
  FeaturedProjectsSection,
  CommercialProjectsSection,
  ResidentialProjectsSection,
  FAQSection,
  ServicesSection,
  NewsletterSection,
  ContactSection,
} from "@/components/homepage";
import Sections from "@/components/homepage/Sections";
import Newsletter from "@/components/homepage/Newsletter";

// Define the Project type based on the Prisma schema
type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: 'COMMERCIAL' | 'RETAIL_ONLY' | 'MIXED_USE' | 'RESIDENTIAL';
  status: 'PLANNED' | 'UNDER_CONSTRUCTION' | 'READY';
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  createdAt: string;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
  isTrending?: boolean;
  totalClicks?: number;
};

type FeaturedDiagnosticsData = {
  missingSlugs: string[];
  mismatchedTitles: { slug: string; title: string }[];
};

type Source = 'db' | 'api' | 'fallback';
type DataSources = { featuredSource: Source; trendingSource: Source };
type HomePageData = {
  featuredProjects: Project[];
  trendingProjects: Project[];
  commercialProjects: Project[];
  residentialProjects: Project[];
  diagnostics: FeaturedDiagnosticsData;
  dataSources: DataSources;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';

export const metadata: Metadata = {
  title: 'Realty Canvas | Verified Properties in Gurgaon | Residential & Commercial | Best Prices',
  description: 'Discover verified residential commercial and residential homes in Gurgaon through Realty Canvas. Benefit from the most competitive prices and transparent deals, speedy paperwork, RERA compliance, and the best ROI with expert post-purchase assistance.',
  keywords: [
    'Gurgaon properties',
    'verified real estate Gurgaon',
    'residential projects Gurgaon',
    'commercial spaces Gurgaon',
    'best property prices',
    'RERA verified properties',
    'Realty Canvas',
    'luxury homes Gurgaon',
    'investment properties Gurgaon',
    'property consultants Gurgaon',
    'quick property registration',
    'post-purchase support real estate',
    'high ROI properties',
    'premium projects Gurgaon',
    "real estate in Gurgaon"
  ],
  alternates: { canonical: `${baseUrl}/` },
  openGraph: {
    title: 'Realty Canvas | Verified Residential Commercial and Residential Homes in Gurgaon | Best Prices',
    description: 'Discover verified residential commercial and residential homes in Gurgaon through Realty Canvas. Benefit from the most competitive prices and transparent deals, speedy paperwork, RERA compliance, and the best ROI with expert post-purchase assistance.',
    url: `${baseUrl}/`,
    siteName: 'Realty Canvas',
    images: [
      {
        url: `${baseUrl}/logo.webp`,
        width: 1200,
        height: 630,
        alt: 'Realty Canvas'
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Realty Canvas | Verified Residential Commercial and Residential Homes in Gurgaon | Best Prices',
    description: 'Discover verified residential commercial and residential homes in Gurgaon through Realty Canvas. Benefit from the most competitive prices and transparent deals, speedy paperwork, RERA compliance, and the best ROI with expert post-purchase assistance.',
    images: [`${baseUrl}/logo.webp`]
  },
  robots: {
    index: true,
    follow: true
  }
};

// Server-side data fetching with ISR
async function getHomePageData(): Promise<HomePageData> {
  try {
    let dataSources: DataSources = { featuredSource: 'db', trendingSource: 'db' };
    // Check database connection first
    const isConnected = await ensureDatabaseConnection(3);
    if (!isConnected) {
      console.error('Database connection failed for homepage data');
      // Attempt to use API cache fallback to avoid empty homepage
      try {
        const res = await fetch(`${baseUrl}/api/projects?limit=12`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const projects = (data?.projects || []).map((p: any) => ({
            ...p,
            createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date(p.createdAt).toISOString(),
          }));
          dataSources = { featuredSource: 'api', trendingSource: 'api' };
          return {
            featuredProjects: projects.slice(0, 9),
            trendingProjects: projects.slice(0, 6),
            commercialProjects: projects.filter((p: any) => p.category === 'COMMERCIAL').slice(0, 6),
            residentialProjects: projects.filter((p: any) => p.category === 'RESIDENTIAL').slice(0, 6),
            diagnostics: { missingSlugs: [], mismatchedTitles: [] },
            dataSources,
          };
        }
      } catch (e) {
        console.error('API fallback failed for homepage data:', e);
      }
      dataSources = { featuredSource: 'fallback', trendingSource: 'fallback' };
      return {
        featuredProjects: [],
        trendingProjects: [],
        commercialProjects: [],
        residentialProjects: [],
        diagnostics: { missingSlugs: [], mismatchedTitles: [] },
        dataSources,
      };
    }

    // Featured project titles to keep (editorial curation)
    const featuredProjectTitles = [
      'Elan The Presidential',
      'Elan The Emperor',
      'DLF Privana North',
      'DLF Privana South',
      'DLF Privana West',
      'Whiteland Westin Residences',
      'Tarc Ishva Gurgaon',
      'SPJ Vedatam',
      'AIPL Joy District'
    ];
    // Prefer selecting by curated slugs to avoid title mismatches
    const curatedSlugs = [
      'elan-the-presidential',
      'elan-the-emperor',
      'dlf-privana-north',
      'dlf-privana-south',
      'dlf-privana-west',
      'whiteland-westin-residences',
      'tarc-ishva-gurgaon',
      'spj-vedatam',
      'aipl-joy-district',
    ];
    
    // Fetch curated featured projects by slug first
    console.log('Fetching curated featured projects by slug:', curatedSlugs);
    let featuredProjectsRaw = await prisma.project.findMany({
      where: { slug: { in: curatedSlugs } },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
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
        minRatePsf: true,
        maxRatePsf: true,
        isTrending: true,
        totalClicks: true,
      },
    });

    // Diagnostics for admin: missing curated slugs and title mismatches
    const missingSlugs = curatedSlugs.filter(
      (slug) => !featuredProjectsRaw.some((p) => p.slug === slug)
    );
    const mismatchedTitles = featuredProjectsRaw
      .filter((p) => !featuredProjectTitles.includes(p.title))
      .map((p) => ({ slug: p.slug, title: p.title }));

    // If curated matches are partial or empty, top up with trending and recent
    if (featuredProjectsRaw.length < 9) {
      const existingIds = new Set(featuredProjectsRaw.map(p => p.id));
      // First, add manually trending projects
      const trendingFill = await prisma.project.findMany({
        where: { isTrending: true, id: { notIn: Array.from(existingIds) } },
        orderBy: [{ totalClicks: 'desc' }, { updatedAt: 'desc' }],
        take: 12,
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
          minRatePsf: true,
          maxRatePsf: true,
          isTrending: true,
          totalClicks: true,
        },
      });
      trendingFill.forEach(p => existingIds.add(p.id));
      featuredProjectsRaw = [...featuredProjectsRaw, ...trendingFill];

      // Then, add most recent projects to ensure we have content
      if (featuredProjectsRaw.length < 9) {
        const recentFill = await prisma.project.findMany({
          where: { id: { notIn: Array.from(existingIds) } },
          orderBy: [{ updatedAt: 'desc' }],
          take: 20,
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
            minRatePsf: true,
            maxRatePsf: true,
            isTrending: true,
            totalClicks: true,
          },
        });
        featuredProjectsRaw = [...featuredProjectsRaw, ...recentFill];
      }
      // Cap to 12 and keep order (curated first, then trending, then recent)
      featuredProjectsRaw = featuredProjectsRaw.slice(0, 12);
    }

    // Convert Date to string for client compatibility
    const featuredProjects = featuredProjectsRaw.map(project => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
    }));

    // Fetch trending projects with layered criteria
    let trendingProjectsRaw = await prisma.project.findMany({
      where: {
        OR: [
          { isTrending: true },
          {
            projectClicks: {
              some: {
                clickDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
              },
            },
          },
          { totalClicks: { gt: 0 } },
        ],
      },
      orderBy: [
        { isTrending: 'desc' },
        { totalClicks: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: 12,
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
        minRatePsf: true,
        maxRatePsf: true,
        isTrending: true,
        totalClicks: true,
      },
    });
    // Absolute fallback to most recent if trending still empty
    if (trendingProjectsRaw.length === 0) {
      trendingProjectsRaw = await prisma.project.findMany({
        orderBy: [{ updatedAt: 'desc' }],
        take: 12,
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
          minRatePsf: true,
          maxRatePsf: true,
          isTrending: true,
          totalClicks: true,
        },
      });
    }

    // Convert Date to string for client compatibility
    const trendingProjects = trendingProjectsRaw.map(project => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
    }));

    // If no trending projects found, fallback to featured or recent
    const finalTrendingProjects = trendingProjects.length > 0
      ? trendingProjects.slice(0, 6)
      : featuredProjects.length > 0
        ? featuredProjects.slice(0, 6)
        : featuredProjectsRaw.slice(0, 6).map(p => ({ ...p, createdAt: p.createdAt.toISOString() }));

    // Fetch commercial projects
    const commercialProjectsRaw = await prisma.project.findMany({
      where: { category: 'COMMERCIAL' },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
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
        minRatePsf: true,
        maxRatePsf: true,
      },
    });
    const commercialProjects = commercialProjectsRaw.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })).slice(0, 6);

    // Fetch residential projects
    const residentialProjectsRaw = await prisma.project.findMany({
      where: { category: 'RESIDENTIAL' },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
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
        minRatePsf: true,
        maxRatePsf: true,
      },
    });
    const residentialProjects = residentialProjectsRaw.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })).slice(0, 6);

    const diagnostics: FeaturedDiagnosticsData = { missingSlugs, mismatchedTitles };
    dataSources = { featuredSource: 'db', trendingSource: 'db' };
    return {
      featuredProjects,
      trendingProjects: finalTrendingProjects,
      commercialProjects,
      residentialProjects,
      diagnostics,
      dataSources,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    const dataSources: DataSources = { featuredSource: 'fallback', trendingSource: 'fallback' };
    return {
      featuredProjects: [],
      trendingProjects: [],
      commercialProjects: [],
      residentialProjects: [],
      diagnostics: { missingSlugs: [], mismatchedTitles: [] },
      dataSources,
    };
  }
}

// Server component with ISR
export default async function Home() {
  // Fetch data on the server with ISR
  const { featuredProjects, trendingProjects, commercialProjects, residentialProjects, diagnostics, dataSources } = await getHomePageData();

  return (
    <main className="flex min-h-screen flex-col pt-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <HeroSection />
      {/* Benefits Section */}
      <BenefitsSection />
      {/* Admin-only diagnostics & fallback source banner */}
      <AdminFallbackBanner dataSources={dataSources} counts={{ featured: featuredProjects.length, trending: trendingProjects.length }} />
      <FeaturedDiagnostics diagnostics={diagnostics} />
      {/* Featured Projects Section - Server-side rendered with ISR */}
      <FeaturedProjectsSection projects={featuredProjects} loading={false} />
      {/* Commercial Projects */}
      <CommercialProjectsSection projects={commercialProjects} loading={false} />
      {/* Residential Projects */}
      <ResidentialProjectsSection projects={residentialProjects} loading={false} />
      {/* Services Section */}
      <ServicesSection />
      {/* Newsletter Section */}
      {/* <NewsletterSection /> */}
      {/* Trending Projects Section - Server-side rendered with ISR */}
      <Sections projects={trendingProjects} loading={false} />
      {/* FAQ Section */}
      <FAQSection />
    </main>
  );
}

// Enable ISR with revalidation every 5 minutes (300 seconds)
export const revalidate = 300;