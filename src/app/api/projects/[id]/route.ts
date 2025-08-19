import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Log the request to help with debugging
    console.log('GET /api/projects/[id] request received', { 
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });
    
    const { id } = await params;
    console.log(`Fetching project with ID: ${id}`);
    
    // Force Prisma to make a fresh database query using transaction
    const project = await prisma.$transaction(async (tx) => {
      return await tx.project.findUnique({
        where: { id },
        include: {
          units: true,
          highlights: true,
          amenities: true,
          faqs: true,
          floorPlans: true,
          documents: true,
          media: true,
          configurations: true,
          anchors: true,
          pricingPlans: true,
          pricingTable: true,
          construction: true,
          nearbyPoints: true,
        },
      });
    });
    
    if (!project) {
      console.log(`Project with ID ${id} not found`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    console.log(`Successfully fetched project: ${project.title}`);
    
    // Set cache control headers to prevent caching
    const response = NextResponse.json(project);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.slug) {
      const exists = await prisma.project.findFirst({
        where: { slug: body.slug, NOT: { id } },
        select: { id: true },
      });
      if (exists) return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }

    // Extract only valid fields for Project model
    const {
      title,
      subtitle,
      description,
      category,
      status,
      reraId,
      developerName,
      developerLogo,
      possessionDate,
      launchDate,
      address,
      locality,
      city,
      state,
      latitude,
      longitude,
      currency,
      featuredImage,
      galleryImages,
      videoUrl,
      videoUrls,
      basePrice,
      priceRange,
      bannerTitle,
      bannerSubtitle,
      bannerDescription,
      aboutTitle,
      aboutDescription,
      sitePlanImage,
      sitePlanTitle,
      sitePlanDescription,
      minRatePsf,
      maxRatePsf,
      minUnitArea,
      maxUnitArea,
      totalUnits,
      soldUnits,
      availableUnits,
    } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title || undefined,
        subtitle: subtitle || null,
        description: description || undefined,
        category: category || undefined,
        status: status || undefined,
        reraId: reraId || null,
        developerName: developerName || null,
        developerLogo: developerLogo || null,
        possessionDate: possessionDate ? new Date(possessionDate) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
        address: address || undefined,
        locality: locality || null,
        city: city || null,
        state: state || null,
        latitude: typeof latitude === 'number' ? latitude : null,
        longitude: typeof longitude === 'number' ? longitude : null,
        currency: currency || undefined,
        featuredImage: featuredImage || undefined,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : undefined,
        videoUrl: videoUrl || null,
        videoUrls: Array.isArray(videoUrls) ? videoUrls : undefined,
        basePrice: basePrice || null,
        priceRange: priceRange || null,
        bannerTitle: bannerTitle || null,
        bannerSubtitle: bannerSubtitle || null,
        bannerDescription: bannerDescription || null,
        aboutTitle: aboutTitle || null,
        aboutDescription: aboutDescription || null,
        sitePlanImage: sitePlanImage || null,
        sitePlanTitle: sitePlanTitle || null,
        sitePlanDescription: sitePlanDescription || null,
        minRatePsf: minRatePsf || null,
        maxRatePsf: maxRatePsf || null,
        minUnitArea: typeof minUnitArea === 'number' ? minUnitArea : null,
        maxUnitArea: typeof maxUnitArea === 'number' ? maxUnitArea : null,
        totalUnits: typeof totalUnits === 'number' ? totalUnits : null,
        soldUnits: typeof soldUnits === 'number' ? soldUnits : null,
        availableUnits: typeof availableUnits === 'number' ? availableUnits : null,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
