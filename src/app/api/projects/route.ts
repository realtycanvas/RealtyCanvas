import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueSlug(base: string) {
  let candidate = base || 'project';
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.project.findFirst({ where: { slug: candidate } });
    if (!exists) return candidate;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/projects request body:', JSON.stringify(body, null, 2));

    const {
      title,
      description,
      address,
      featuredImage,
      galleryImages = [],
      subtitle,
      category = 'COMMERCIAL',
      status = 'PLANNED',
      locality,
      city,
      state,
      reraId,
      developerName,
      developerLogo,
      possessionDate,
      launchDate,
      latitude,
      longitude,
      currency = 'INR',
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      aboutTitle,
      aboutDescription,
      sitePlanImage,
      sitePlanTitle,
      sitePlanDescription,
      slug,
      isTrending = false,
    } = body || {};

    if (!title || !description || !address || !featuredImage) {
      console.log('Missing required fields:', {
        title: !!title,
        description: !!description,
        address: !!address,
        featuredImage: !!featuredImage
      });
      return NextResponse.json({ 
        error: 'Missing required fields (title, description, address, featuredImage)',
        received: {
          title: !!title,
          description: !!description,
          address: !!address,
          featuredImage: !!featuredImage
        }
      }, { status: 400 });
    }

    const baseSlug = slug ? slugify(slug) : slugify(title);
    const finalSlug = await uniqueSlug(baseSlug);

    const project = await prisma.project.create({
      data: {
        slug: finalSlug,
        title,
        subtitle: subtitle || null,
        description,
        category,
        status,
        reraId: reraId || null,
        developerName: developerName || null,
        developerLogo: developerLogo || null,
        possessionDate: possessionDate ? new Date(possessionDate) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
        address,
        locality: locality || null,
        city: city || null,
        state: state || null,
        latitude: typeof latitude === 'number' ? latitude : null,
        longitude: typeof longitude === 'number' ? longitude : null,
        currency,
        featuredImage,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        bannerTitle: bannerTitle || null,
        bannerSubtitle: bannerSubtitle || null,
        bannerDescription: bannerDescription || null,
        aboutTitle: aboutTitle || null,
        aboutDescription: aboutDescription || null,
        sitePlanImage: sitePlanImage || null,
        sitePlanTitle: sitePlanTitle || null,
        sitePlanDescription: sitePlanDescription || null,
        isTrending: Boolean(isTrending),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Log the request to help with debugging
    console.log('GET /api/projects request received', { 
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;
    
    console.log(`Pagination: page=${page}, limit=${limit}, skip=${skip}`);
    
    // Get total count for pagination info
    const totalCount = await prisma.project.count();
    
    // Query projects with pagination, ordered by updatedAt (most recently updated first)
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
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
        galleryImages: true,
        createdAt: true,
        updatedAt: true,
        minRatePsf: true,
        maxRatePsf: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    console.log(`Found ${projects.length} projects (page ${page}/${totalPages}, total: ${totalCount})`);

    const responseData = {
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
        hasPrevious: page > 1
      }
    };

    // Set cache control headers
    const response = NextResponse.json(responseData);
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    response.headers.set('X-Response-Time', Date.now().toString());

    return response;
  } catch (error) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
