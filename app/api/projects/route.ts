import { prisma } from '@/lib/prisma';
import { Prisma, ProjectCategory, ProjectStatus } from '@/app/generated/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache, revalidatePath, revalidateTag } from 'next/cache';
import { PROJECT_TAGS, getTagMeta } from '@/lib/project-tags';

// ─── Cache Tag ────────────────────────────────────────────────────────────────
const PROJECTS_TAG = 'projects-list';

function parsePriceToRupees(raw: unknown): number | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s) return null;
  const lower = s.toLowerCase();
  const numStr = lower.replace(/[^0-9.]/g, '');
  if (!numStr) return null;
  const n = Number.parseFloat(numStr);
  if (!Number.isFinite(n) || n <= 0) return null;
  const isCrore = /\b(crore|crores|cr)\b/.test(lower);
  const isLakh = /\b(lakh|lakhs|lac|lacs)\b/.test(lower);
  const multiplier = isCrore ? 10000000 : isLakh ? 100000 : 1;
  return Math.round(n * multiplier);
}

// ─── Cached DB Fetch ──────────────────────────────────────────────────────────
function getProjectsFromDB(filters: {
  page: number;
  limit: number;
  search: string;
  category: string;
  status: string;
  city: string;
  projectTag?: string;
  includeInactive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) {
  return unstable_cache(
    async () => {
      const { page, limit, search, category, status, city, projectTag, includeInactive, minPrice, maxPrice } = filters;
      const skip = (page - 1) * limit;

      const where: Prisma.ProjectWhereInput = includeInactive ? {} : { isActive: true };

      if (search.length >= 2) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { developerName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category !== 'ALL') where.category = category as ProjectCategory;
      if (status !== 'ALL') where.status = status as ProjectStatus;
      if (city) where.city = { contains: city, mode: 'insensitive' };
      if (projectTag) where.projectTags = { has: projectTag };
      const hasMin = typeof minPrice === 'number' && minPrice > 0;
      const hasMax = typeof maxPrice === 'number' && maxPrice > 0;

      const select = {
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
        basePrice: true,
        priceMin: true,
        minRatePsf: true,
        maxRatePsf: true,
        developerName: true,
        locality: true,
        createdAt: true,
        isActive: true,
      } satisfies Prisma.ProjectSelect;

      if (!hasMin && !hasMax) {
        const [projects, totalCount] = await Promise.all([
          prisma.project.findMany({
            where,
            skip,
            take: limit,
            orderBy: { updatedAt: 'desc' },
            select,
          }),
          prisma.project.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
          data: projects.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
          })),
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasMore: page < totalPages,
            hasPrevious: page > 1,
          },
        };
      }

      const candidates = await prisma.project.findMany({
        where,
        take: 2000,
        orderBy: { updatedAt: 'desc' },
        select,
      });

      const filtered = candidates.filter((p) => {
        const derivedMin = p.priceMin ?? parsePriceToRupees(p.basePrice);
        if (derivedMin == null) return false;
        if (hasMin && derivedMin < (minPrice as number)) return false;
        if (hasMax && derivedMin > (maxPrice as number)) return false;
        return true;
      });

      const totalCount = filtered.length;
      const totalPages = Math.ceil(totalCount / limit);
      const pageItems = filtered.slice(skip, skip + limit);

      return {
        data: pageItems.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    },
    // Cache key — unique per filter combo
    [PROJECTS_TAG, JSON.stringify(filters)],
    {
      revalidate: 60, // 60 seconds TTL
      tags: [PROJECTS_TAG], // revalidateTag se instantly clear hoga
    }
  )();
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10'));
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category') || 'ALL';
    const status = searchParams.get('status') || 'ALL';
    const city = searchParams.get('city')?.trim() || '';
    const slug = searchParams.get('slug')?.trim() || '';
    const projectTag = searchParams.get('projectTag')?.trim() || '';
    const groupByTags = searchParams.get('groupByTags') === '1';
    const includeInactive = searchParams.get('includeInactive') === '1';
    const minPriceRaw = searchParams.get('minPrice')?.trim() || '';
    const maxPriceRaw = searchParams.get('maxPrice')?.trim() || '';
    let minPrice = minPriceRaw ? parseInt(minPriceRaw, 10) : 0;
    let maxPrice = maxPriceRaw ? parseInt(maxPriceRaw, 10) : 0;
    if (minPrice > 0 && maxPrice > 0 && minPrice > maxPrice) {
      const temp = minPrice;
      minPrice = maxPrice;
      maxPrice = temp;
    }
    const tagLimit = Math.min(12, Math.max(1, parseInt(searchParams.get('tagLimit') || '6')));

    if (groupByTags) {
      const tagRows = await prisma.project.findMany({
        where: { isActive: true },
        select: { projectTags: true },
      });
      const existingTags = tagRows.flatMap((row) => row.projectTags || []);
      const knownTags = PROJECT_TAGS.map((tag) => tag.value);
      const allTags = Array.from(new Set([...knownTags, ...existingTags]));

      const sections = [
        { tag: 'RECOMMENDED', title: 'Realty Canvas Recommended' },
        { tag: 'TRENDING', title: 'Trending Projects in Gurugram' },
        { tag: 'NEW', title: 'New Launch Projects in Gurgaon' },
        { tag: 'BUDGET', title: 'Best Budget Projects in Gurugram' },
        { tag: 'DREAM', title: 'Dream Properties In The Heart of Gurugram' },
        { tag: 'BUDGET_PLOTS', title: 'Best Budget Plots in Gurugram' },
        { tag: 'COMMERCIAL_GURUGRAM', title: 'Commercial Projects in Gurugram' },
      ];

      const sectionResults = await Promise.all(
        sections.map(async (section) => {
          const [projects, totalCount] = await Promise.all([
            prisma.project.findMany({
              where: { isActive: true, projectTags: { has: section.tag } },
              take: tagLimit,
              orderBy: { updatedAt: 'desc' },
              select: {
                id: true,
                slug: true,
                title: true,
                subtitle: true,
                category: true,
                status: true,
                city: true,
                featuredImage: true,
                basePrice: true,
                developerName: true,
                createdAt: true,
              },
            }),
            prisma.project.count({ where: { isActive: true, projectTags: { has: section.tag } } }),
          ]);

          return {
            tag: section.tag,
            title: section.title,
            totalCount,
            projects: projects.map((p) => ({
              ...p,
              createdAt: p.createdAt.toISOString(),
            })),
          };
        })
      );

      const tagDetails = await Promise.all(
        allTags.map(async (value) => {
          const meta = getTagMeta(value);
          const label =
            meta?.label ||
            value
              .toLowerCase()
              .split('_')
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');
          const count = await prisma.project.count({ where: { isActive: true, projectTags: { has: value } } });
          return { value, label, count };
        })
      );

      return NextResponse.json({ sections: sectionResults, tags: tagDetails });
    }

    // ── Slug fetch — no cache needed (admin/detail use) ──
    if (slug) {
      const normalized = decodeURIComponent(slug)
        .trim()
        .replace(/^\/+|\/+$/g, '');

      const project = await prisma.project.findFirst({
        where: { slug: { equals: normalized, mode: 'insensitive' }, isActive: true },
        include: {
          amenities: { orderBy: { sortOrder: 'asc' } },
          highlights: { orderBy: { sortOrder: 'asc' } },
          faqs: { orderBy: { sortOrder: 'asc' } },
          media: { orderBy: { sortOrder: 'asc' } },
          pricingTable: true,
          nearbyPoints: true,
        },
      });

      if (!project) {
        return NextResponse.json({ error: `Project with slug '${slug}' not found` }, { status: 404 });
      }

      return NextResponse.json(project);
    }

    // ── Listing — cached ──
    const responseData = await getProjectsFromDB({
      page,
      limit,
      search,
      category,
      status,
      city,
      projectTag,
      includeInactive,
      minPrice: Number.isFinite(minPrice) ? minPrice : 0,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : 0,
    });

    return NextResponse.json(responseData, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'slug', 'description', 'address', 'featuredImage'];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const slug = body.slug.toLowerCase().trim();

    const existingProject = await prisma.project.findUnique({ where: { slug } });
    if (existingProject) {
      return NextResponse.json({ error: 'Project with this slug already exists' }, { status: 409 });
    }

    const parseJsonValue = (value: unknown) => {
      if (!value) return null;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    };

    const seoPayload = body.seo
      ? {
          metaTitle: body.seo.metaTitle || null,
          metaDescription: body.seo.metaDescription || null,
          metaKeywords: body.seo.metaKeywords || [],
          canonicalUrl: body.seo.canonicalUrl || null,
          ogTitle: body.seo.ogTitle || null,
          ogDescription: body.seo.ogDescription || null,
          ogImage: body.seo.ogImage || null,
          twitterCard: body.seo.twitterCard || 'summary_large_image',
          schemaMarkup: body.seo.schemaMarkup || null,
          h1Tag: body.seo.h1Tag || null,
          h2Tags: body.seo.h2Tags || [],
          featuredImgAlt: body.seo.featuredImgAlt || null,
          imageAltMap: body.seo.imageAltMap || {},
          localHeading: body.seo.localHeading || null,
          localContent: body.seo.localContent || null,
          longFormTitle: body.seo.longFormTitle || null,
          longFormContent: body.seo.longFormContent || null,
          isIndexable: body.seo.isIndexable ?? true,
          sitemapPriority: body.seo.sitemapPriority ?? 0.8,
        }
      : null;

    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() || null,
        slug,
        description: body.description.trim(),
        category: body.category || 'COMMERCIAL',
        status: body.status || 'PLANNED',
        address: body.address.trim(),
        locality: body.locality?.trim() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
        latitude: body.latitude ?? null,
        longitude: body.longitude ?? null,
        currency: body.currency || 'INR',
        developerName: body.developerName?.trim() || null,
        developerLogo: body.developerLogo?.trim() || null,
        reraId: body.reraId?.trim() || null,
        possessionDate: body.possessionDate ? new Date(body.possessionDate) : null,
        launchDate: body.launchDate ? new Date(body.launchDate) : null,
        basePrice: body.basePrice?.trim() || null,
        priceRange: body.priceRange?.trim() || null,
        priceMin: parsePriceToRupees(body.basePrice) ?? body.priceMin ?? null,
        priceMax: body.priceMax ?? null,
        featuredImage: body.featuredImage.trim(),
        landArea: body.landArea?.trim() || null,
        totalUnits: body.totalUnits ?? null,
        soldUnits: body.soldUnits ?? null,
        availableUnits: body.availableUnits ?? null,
        numberOfTowers: body.numberOfTowers ?? null,
        numberOfFloors: body.numberOfFloors ?? null,
        numberOfApartments: body.numberOfApartments ?? null,
        minRatePsf: body.minRatePsf?.trim() || null,
        maxRatePsf: body.maxRatePsf?.trim() || null,
        minUnitArea: body.minUnitArea ?? null,
        maxUnitArea: body.maxUnitArea ?? null,
        bannerTitle: body.bannerTitle?.trim() || null,
        bannerSubtitle: body.bannerSubtitle?.trim() || null,
        bannerDescription: body.bannerDescription?.trim() || null,
        aboutTitle: body.aboutTitle?.trim() || null,
        aboutDescription: body.aboutDescription?.trim() || null,
        sitePlanTitle: body.sitePlanTitle?.trim() || null,
        sitePlanImage: body.sitePlanImage?.trim() || null,
        sitePlanDescription: body.sitePlanDescription?.trim() || null,
        seoTitle: seoPayload?.metaTitle || body.seoTitle?.trim() || null,
        seoDescription: seoPayload?.metaDescription || body.seoDescription?.trim() || null,
        seoKeywords: seoPayload?.metaKeywords || body.seoKeywords || [],
        galleryImages: body.galleryImages || [],
        videoUrls: body.videoUrls || [],
        projectTags: body.projectTags || [],
        isActive: body.isActive ?? true,
        highlights: {
          create: (body.highlights || []).map(
            (h: { label?: string; icon?: string; sortOrder?: number }, i: number) => ({
              label: h.label?.trim() || '',
              icon: h.icon?.trim() || null,
              sortOrder: h.sortOrder ?? i + 1,
            })
          ),
        },
        amenities: {
          create: (body.amenities || []).map(
            (a: { category?: string; name?: string; details?: string; sortOrder?: number }, i: number) => ({
              category: a.category?.trim() || '',
              name: a.name?.trim() || '',
              details: a.details?.trim() || null,
              sortOrder: a.sortOrder ?? i + 1,
            })
          ),
        },
        offerings: {
          create: (body.offerings || []).map(
            (o: { icon?: string; title?: string; description?: string; sortOrder?: number }, i: number) => ({
              icon: o.icon?.trim() || null,
              title: o.title?.trim() || '',
              description: o.description?.trim() || '',
              sortOrder: o.sortOrder ?? i + 1,
            })
          ),
        },
        pricingTable: {
          create: (body.pricingTable || []).map(
            (p: {
              unitArea?: string;
              type?: string;
              reraArea?: string;
              price?: string;
              pricePerSqft?: string;
              availabilityStatus?: string | null;
              floorNumbers?: string;
              features?: unknown;
            }) => ({
              unitArea: p.unitArea?.trim() || null,
              type: p.type?.trim() || '',
              reraArea: p.reraArea?.trim() || '',
              price: p.price?.trim() || '',
              pricePerSqft: p.pricePerSqft?.trim() || null,
              availabilityStatus: p.availabilityStatus?.trim() || null,
              floorNumbers: p.floorNumbers?.trim() || null,
              features: p.features ?? null,
            })
          ),
        },
        nearbyPoints: {
          create: (body.nearbyPoints || []).map(
            (n: { type: string; name?: string; distanceKm?: number | null; travelTimeMin?: number | null }) => ({
              type: n.type,
              name: n.name?.trim() || '',
              distanceKm: n.distanceKm ?? null,
              travelTimeMin: n.travelTimeMin ?? null,
            })
          ),
        },
        floorPlans: {
          create: (body.floorPlans || []).map(
            (
              fp: { level?: string; title?: string; imageUrl?: string; details?: unknown; sortOrder?: number },
              i: number
            ) => ({
              level: fp.level?.trim() || '',
              title: fp.title?.trim() || null,
              imageUrl: fp.imageUrl?.trim() || '',
              details: parseJsonValue(fp.details),
              sortOrder: fp.sortOrder ?? i + 1,
            })
          ),
        },
        faqs: {
          create: (body.faqs || []).map(
            (fq: { question?: string; answer?: string; sortOrder?: number }, i: number) => ({
              question: fq.question?.trim() || '',
              answer: fq.answer?.trim() || '',
              sortOrder: fq.sortOrder ?? i + 1,
            })
          ),
        },
        seo: seoPayload ? { create: seoPayload } : undefined,
      },
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);
    revalidateTag(PROJECTS_TAG, 'default');

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
