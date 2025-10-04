import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withDatabaseRetry, periodicHealthCheck } from '@/middleware/database';

// In-memory cache for frequently accessed projects
const projectCache = new Map<string, { data: any; timestamp: number; etag: string }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached project
function getCachedProject(id: string) {
  const cached = projectCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }
  return null;
}

// Helper function to set cached project
function setCachedProject(id: string, data: any, etag: string) {
  projectCache.set(id, {
    data,
    timestamp: Date.now(),
    etag
  });
  
  // Clean up old cache entries
  if (projectCache.size > 100) {
    const oldestKey = projectCache.keys().next().value;
    if (oldestKey) {
      projectCache.delete(oldestKey);
    }
  }
}
async function getProjectHandler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Fetching project with ID: ${id}`);
    
    // Check if ID is valid
    if (!id) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Check for ETag caching
    const ifNoneMatch = req.headers.get('if-none-match');
    
    // Check in-memory cache first
    const cached = getCachedProject(id);
    if (cached) {
      console.log(`Serving project from cache: ${id}`);
      
      // Check if client has cached version
      if (ifNoneMatch === cached.etag) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            'ETag': cached.etag,
            'X-Cache': 'HIT-304'
          }
        });
      }
      
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'ETag': cached.etag,
          'X-Cache': 'HIT',
          'X-Response-Time': Date.now().toString()
        }
      });
    }
    
    // Perform health check only if not in cache
    await periodicHealthCheck();
    
    // Optimized query using slug with better performance and reduced data transfer
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
          orderBy: [{ floor: 'asc' }, { unitNumber: 'asc' }],
          take: 20 // Reduced for faster initial load
        },
        highlights: {
          select: {
            id: true,
            label: true,
            icon: true
          },
          orderBy: { id: 'asc' }
        },
        amenities: {
          select: {
            id: true,
            category: true,
            name: true,
            details: true
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }]
        },
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true
          },
          orderBy: { id: 'asc' }
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
          orderBy: [{ sortOrder: 'asc' }, { level: 'asc' }]
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
          orderBy: [{ status: 'asc' }, { name: 'asc' }]
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
          orderBy: { id: 'asc' }
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
          orderBy: { id: 'asc' }
        },
        nearbyPoints: {
          select: {
            id: true,
            type: true,
            name: true,
            distanceKm: true,
            travelTimeMin: true
          },
          orderBy: [{ type: 'asc' }, { distanceKm: 'asc' }]
        }
      },
    });
    
    if (!project) {
      console.log(`Project with ID/slug ${id} not found`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate ETag based on project data
    const etag = `"${Buffer.from(JSON.stringify({ id: project.id, updatedAt: project.updatedAt })).toString('base64')}"`;
    
    // Store in cache
    setCachedProject(id, project, etag);
    
    // Check if client has cached version
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { 
        status: 304,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'ETag': etag,
          'X-Cache': 'MISS-304'
        }
      });
    }

    console.log(`Successfully fetched project: ${project.title}`);
    
    return NextResponse.json(project, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'ETag': etag,
        'X-Cache': 'MISS',
        'X-Response-Time': Date.now().toString()
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

async function putProjectHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.slug) {
      const exists = await prisma.project.findFirst({
        where: { slug: body.slug, NOT: { slug: id } },
        select: { id: true },
      });
      if (exists) return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }

    // Extract only valid fields for Project model
    const {
      title,
      subtitle,
      description,
      features,
      status,
      category,
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
      // Residential project specific fields
      landArea,
      numberOfTowers,
      numberOfApartments,
      // Commercial project specific fields
      numberOfFloors,
    } = body;

    // Get current project to check category if not provided in update
    const currentProject = await prisma.project.findUnique({
      where: { slug: id },
      select: { category: true }
    });

    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Determine the project category (use provided category or existing one)
    const projectCategory = category || currentProject.category;

    // Prepare update data - only include features for commercial projects
    const updateData: any = {
      title: title || undefined,
      subtitle: subtitle || null,
      description: description || undefined,
      status: status || undefined,
      category: category || undefined,
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
      // Residential project specific fields
      landArea: landArea || null,
      numberOfTowers: typeof numberOfTowers === 'number' ? numberOfTowers : null,
      numberOfApartments: typeof numberOfApartments === 'number' ? numberOfApartments : null,
      // Commercial project specific fields
      numberOfFloors: typeof numberOfFloors === 'number' ? numberOfFloors : null,
    };

    // Only include features for commercial projects
    if (projectCategory === 'COMMERCIAL') {
      updateData.features = features || null;
    }

    const updated = await prisma.project.update({
      where: { slug: id },
      data: updateData,
    });
    
    // Clear cache for this project
    projectCache.delete(id);
    console.log(`Cleared cache for project: ${id}`);
    
    // Trigger revalidation for the project detail page
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `/projects/${id}` })
      });
      console.log(`Triggered revalidation for /projects/${id}`);
    } catch (revalidateError) {
      console.warn('Failed to trigger revalidation:', revalidateError);
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

async function deleteProjectHandler(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { slug: id } });
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// Export wrapped handlers with database retry logic
export const GET = withDatabaseRetry(getProjectHandler);
export const PUT = withDatabaseRetry(putProjectHandler);
export const DELETE = withDatabaseRetry(deleteProjectHandler);
