import { prisma, ensureDatabaseConnection } from '@/lib/prisma';
import { FeaturedDiagnostics } from '@/components/homepage';
// Homepage Components
import {
  HeroSection,
  PropertySearchSection,
  BenefitsSection,
  FeaturedProjectsSection,
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

// Server-side data fetching with ISR
async function getHomePageData() {
  try {
    // Check database connection first
    const isConnected = await ensureDatabaseConnection(3);
    if (!isConnected) {
      console.error('Database connection failed for homepage data');
      return {
        featuredProjects: [],
        trendingProjects: [],
        diagnostics: { missingSlugs: [], mismatchedTitles: [] },
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

    // If still empty (no curated matches), fallback to trending/recents
    if (featuredProjectsRaw.length === 0) {
      featuredProjectsRaw = await prisma.project.findMany({
        where: { OR: [{ isTrending: true }] },
        orderBy: [{ updatedAt: 'desc' }],
        take: 8,
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
    const featuredProjects = featuredProjectsRaw.map(project => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
    }));

    // Fetch trending projects (most clicked in last 30 days)
    const trendingProjectsRaw = await prisma.project.findMany({
      where: {
        projectClicks: {
          some: {
            clickDate: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }
      },
      orderBy: [
        { totalClicks: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: 6,
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

    // Convert Date to string for client compatibility
    const trendingProjects = trendingProjectsRaw.map(project => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
    }));

    // If no trending projects found, fallback to recent projects
    const finalTrendingProjects = trendingProjects.length > 0 
      ? trendingProjects 
      : featuredProjects.slice(0, 6);

    const diagnostics: FeaturedDiagnosticsData = { missingSlugs, mismatchedTitles };
    return {
      featuredProjects,
      trendingProjects: finalTrendingProjects,
      diagnostics,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      featuredProjects: [],
      trendingProjects: [],
      diagnostics: { missingSlugs: [], mismatchedTitles: [] },
    };
  }
}

// Server component with ISR
export default async function Home() {
  // Fetch data on the server with ISR
  const { featuredProjects, trendingProjects, diagnostics } = await getHomePageData();

  return (
    <main className="flex min-h-screen flex-col pt-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Admin-only diagnostics banner */}
      <FeaturedDiagnostics diagnostics={diagnostics} />

      {/* Featured Projects Section - Server-side rendered with ISR */}
      <FeaturedProjectsSection projects={featuredProjects} loading={false} />

      {/* Services Section */}
      <ServicesSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Trending Projects Section - Server-side rendered with ISR */}
      <Sections projects={trendingProjects} loading={false} />
    </main>
  );
}

// Enable ISR with revalidation every 5 minutes (300 seconds)
export const revalidate = 300;