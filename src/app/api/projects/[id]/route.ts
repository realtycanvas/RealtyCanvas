import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Fetching project with ID: ${id}`);
    
    // Check if ID is valid
    if (!id) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Check for ETag caching
    const ifNoneMatch = req.headers.get('if-none-match');
    const cacheKey = `project-${id}`;
    
    // Optimized query using slug only for better performance
    const project = await prisma.project.findUnique({
      where: { slug: id },
      include: {
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
          orderBy: { unitNumber: 'asc' },
          take: 20 // Reduced for better performance
        },
        highlights: {
          select: {
            id: true,
            label: true,
            icon: true
          },
          orderBy: { id: 'asc' },
          take: 10
        },
        amenities: {
          select: {
            id: true,
            category: true,
            name: true,
            details: true
          },
          orderBy: { category: 'asc' },
          take: 20
        },
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true
          },
          orderBy: { id: 'asc' },
          take: 10
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
          orderBy: { sortOrder: 'asc' }
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
          orderBy: { name: 'asc' },
          take: 10
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
          orderBy: { id: 'asc' },
          take: 5
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
          orderBy: { id: 'asc' },
          take: 10
        },
        nearbyPoints: {
          select: {
            id: true,
            type: true,
            name: true,
            distanceKm: true,
            travelTimeMin: true
          },
          orderBy: { distanceKm: 'asc' },
          take: 15
        }
      },
    });
    
    if (!project) {
      console.log(`Project with ID/slug ${id} not found`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate ETag based on project data
    const etag = `"${Buffer.from(JSON.stringify({ id: project.id, updatedAt: project.updatedAt })).toString('base64')}"`;
    
    // Check if client has cached version
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'ETag': etag
        }
      });
    }

    console.log(`Successfully fetched project: ${project.title}`);
    
    return NextResponse.json(project, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'ETag': etag,
        'X-Response-Time': Date.now().toString()
      }
    });
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
