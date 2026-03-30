import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getUploadDir } from '@/lib/upload';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const PROJECTS_TAG = 'projects-list';

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    // Fetch project with all related data
    const project = await prisma.project.findUnique({
      where: { slug: normalizedSlug },
      include: {
        amenities: {
          orderBy: { sortOrder: 'asc' },
        },
        highlights: {
          orderBy: { sortOrder: 'asc' },
        },
        faqs: {
          orderBy: { sortOrder: 'asc' },
        },
        floorPlans: {
          orderBy: { sortOrder: 'asc' },
        },
        offerings: {
          orderBy: { sortOrder: 'asc' },
        },
        media: {
          orderBy: { sortOrder: 'asc' },
        },
        documents: true,
        pricingTable: true,
        nearbyPoints: true,
        seo: true,
      },
    });

    if (!project) {
      console.error(`[Project API] Project not found with slug: "${normalizedSlug}"`);
      return NextResponse.json({ error: `Project with slug '${slug}' not found` }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
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

const extractUploadFileName = (url: string) => {
  if (!url) return null;
  const base = process.env.UPLOAD_BASE_URL;
  const clean = url.split('?')[0].split('#')[0];
  if (clean.startsWith('/uploads/')) {
    return clean.replace(/^\/uploads\//, '');
  }
  if (base && clean.startsWith(base)) {
    return clean.slice(base.length).replace(/^\/+/, '');
  }
  try {
    const parsed = new URL(clean);
    if (parsed.pathname.startsWith('/uploads/')) {
      return parsed.pathname.replace(/^\/uploads\//, '');
    }
    if (base) {
      const baseUrl = new URL(base);
      if (parsed.origin === baseUrl.origin) {
        return parsed.pathname.replace(/^\/+/, '');
      }
    }
  } catch {
    return null;
  }
  return null;
};

const deleteUploads = async (urls: (string | null | undefined)[]) => {
  if (!process.env.UPLOAD_DIR) return;
  const files = urls
    .filter((u): u is string => typeof u === 'string' && u.length > 0)
    .map((u) => extractUploadFileName(u))
    .filter((u): u is string => Boolean(u));
  if (!files.length) return;
  const dir = getUploadDir();
  await Promise.all(
    files.map(async (file) => {
      try {
        await fs.unlink(path.join(dir, file));
      } catch {
        return;
      }
    })
  );
};

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
    const body = await request.json();

    const requiredFields = ['title', 'slug', 'description', 'address', 'featuredImage'];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const nextSlug = body.slug.toLowerCase().trim();
    if (nextSlug !== normalizedSlug) {
      const existingProject = await prisma.project.findUnique({ where: { slug: nextSlug } });
      if (existingProject) {
        return NextResponse.json({ error: 'Project with this slug already exists' }, { status: 409 });
      }
    }

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

    const project = await prisma.project.update({
      where: { slug: normalizedSlug },
      data: {
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() || null,
        slug: nextSlug,
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
        priceMin: body.priceMin ?? null,
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
          deleteMany: {},
          create: (body.highlights || []).map(
            (h: { label?: string; icon?: string; sortOrder?: number }, i: number) => ({
              label: h.label?.trim() || '',
              icon: h.icon?.trim() || null,
              sortOrder: h.sortOrder ?? i + 1,
            })
          ),
        },
        amenities: {
          deleteMany: {},
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
          deleteMany: {},
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
          deleteMany: {},
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
          deleteMany: {},
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
          deleteMany: {},
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
          deleteMany: {},
          create: (body.faqs || []).map(
            (fq: { question?: string; answer?: string; sortOrder?: number }, i: number) => ({
              question: fq.question?.trim() || '',
              answer: fq.answer?.trim() || '',
              sortOrder: fq.sortOrder ?? i + 1,
            })
          ),
        },
        seo: seoPayload
          ? {
              upsert: {
                create: seoPayload,
                update: seoPayload,
              },
            }
          : undefined,
      },
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);
    revalidateTag(PROJECTS_TAG, 'default');
    return NextResponse.json(project);
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }
    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
    let permanent = request.nextUrl.searchParams.get('permanent') !== '0';
    try {
      const body = await request.json();
      if (typeof body?.permanent === 'boolean') {
        permanent = body.permanent;
      }
    } catch {
      permanent = permanent || false;
    }

    const project = await prisma.project.findUnique({
      where: { slug: normalizedSlug },
      include: {
        floorPlans: true,
        media: true,
        documents: true,
        seo: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!permanent) {
      await prisma.project.update({
        where: { slug: normalizedSlug },
        data: { isActive: false },
      });
      revalidatePath('/projects');
      revalidatePath(`/projects/${normalizedSlug}`);
      revalidatePath('/admin/projects');
      revalidateTag(PROJECTS_TAG, 'default');
      return NextResponse.json({ ok: true, mode: 'soft' });
    }

    const urls: (string | null | undefined)[] = [
      project.featuredImage,
      project.sitePlanImage,
      project.developerLogo,
      ...(project.galleryImages || []),
      ...(project.videoUrls || []),
      ...(project.floorPlans || []).map((fp) => fp.imageUrl),
      ...(project.media || []).map((m) => m.url),
      ...(project.documents || []).map((d) => d.fileUrl),
      project.seo?.ogImage || null,
    ];

    await prisma.project.delete({ where: { slug: normalizedSlug } });
    await deleteUploads(urls);

    revalidatePath('/projects');
    revalidatePath(`/projects/${normalizedSlug}`);
    revalidatePath('/admin/projects');
    revalidateTag(PROJECTS_TAG, 'default');
    return NextResponse.json({ ok: true, mode: 'hard' });
  } catch (error) {
    console.error('Project delete error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body?.isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive boolean is required' }, { status: 400 });
    }

    const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

    const project = await prisma.project.update({
      where: { slug: normalizedSlug },
      data: { isActive: body.isActive },
      select: { id: true, slug: true, isActive: true },
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${normalizedSlug}`);
    revalidatePath('/admin/projects');
    revalidateTag(PROJECTS_TAG, 'default');
    return NextResponse.json({ ok: true, project });
  } catch (error) {
    console.error('Project status update error:', error);
    return NextResponse.json({ error: 'Failed to update project status' }, { status: 500 });
  }
}
