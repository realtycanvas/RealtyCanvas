import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseConnection } from '@/lib/prisma';
import { withDatabaseConnection, periodicHealthCheck } from '@/middleware/database';
import { revalidatePath } from 'next/cache';
import { clearWarmProject } from '@/lib/project-warm-cache';

// Enhanced in-memory cache with better TTL management
const projectCache = new Map<string, { 
  data: any; 
  timestamp: number; 
  etag: string;
  // Add cache metadata
  accessCount: number;
  lastAccessed: number;
}>();

const CACHE_TTL = 2 * 60 * 1000; // Reduced to 2 minutes for fresher data
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

// Cache cleanup function
function cleanupCache() {
  const now = Date.now();
  const entries = Array.from(projectCache.entries());
  
  // Remove expired entries
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_TTL) {
      projectCache.delete(key);
    }
  });
  
  // If still too large, remove least recently accessed
  if (projectCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      .slice(0, projectCache.size - MAX_CACHE_SIZE);
    
    sortedEntries.forEach(([key]) => projectCache.delete(key));
  }
}

// Helper function to get cached project
function getCachedProject(id: string) {
  const cached = projectCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    // Update access metadata
    cached.accessCount++;
    cached.lastAccessed = Date.now();
    return cached;
  }
  
  // Remove expired cache entry
  if (cached) {
    projectCache.delete(id);
  }
  return null;
}

// Helper function to set cached project
function setCachedProject(id: string, data: any, etag: string) {
  // Run cleanup before adding new entry
  cleanupCache();
  
  projectCache.set(id, {
    data,
    timestamp: Date.now(),
    etag,
    accessCount: 1,
    lastAccessed: Date.now()
  });
}

async function getProjectHandler(req: NextRequest, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  
  try {
    const { id } = params;
    console.log(`🔍 Fetching project with ID: ${id}`);
    
    // Check if ID is valid
    if (!id) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Check for ETag caching
    const ifNoneMatch = req.headers.get('if-none-match');
    
    // Check in-memory cache first
    const cached = getCachedProject(id);
    if (cached) {
      console.log(`✅ Cache HIT for project: ${id} (${Date.now() - startTime}ms)`);
      
      // Check if client has cached version
      if (ifNoneMatch === cached.etag) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            'ETag': cached.etag,
            'X-Cache': 'HIT-304',
            'X-Response-Time': (Date.now() - startTime).toString()
          }
        });
      }
      
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'ETag': cached.etag,
          'X-Cache': 'HIT',
          'X-Response-Time': (Date.now() - startTime).toString()
        }
      });
    }
    
    console.log(`🔍 Cache MISS for project: ${id} - fetching from DB`);
    
    // Ensure database connection before querying
    const connected = await ensureDatabaseConnection(2);
    if (!connected) {
      console.error(`❌ Database not connected for project API: ${id}`);
      return NextResponse.json({
        error: 'Database connection unavailable',
        message: 'Service temporarily unavailable. Please try again later.'
      }, { status: 503 });
    }

    // Perform health check only if not in cache
    await periodicHealthCheck();
    
    // Optimized query with selective data loading for better performance
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: {
        // Core project data
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        status: true,
        address: true,
        locality: true,
        city: true,
        state: true,
        // pincode: true,
        
        // Media (optimized)
        featuredImage: true,
        galleryImages: true,
        
        // Pricing
        minRatePsf: true,
        maxRatePsf: true,
        
        // Developer info
        developerName: true,
        developerLogo: true,
        
        // Timestamps
        createdAt: true,
        updatedAt: true,
        
        // Related data with optimized selects
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
          take: 15 // Reduced for faster initial load
        },
        
        highlights: {
          select: {
            id: true,
            label: true,
            icon: true
          },
          orderBy: { id: 'asc' },
          take: 10 // Limit highlights
        },
        
        amenities: {
          select: {
            id: true,
            category: true,
            name: true,
            details: true
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
          take: 20 // Limit amenities
        },
        
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true
          },
          orderBy: { id: 'asc' },
          take: 10 // Limit FAQs for initial load
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
          orderBy: [{ sortOrder: 'asc' }, { level: 'asc' }],
          take: 8 // Limit floor plans
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
          orderBy: [{ status: 'asc' }, { name: 'asc' }],
          take: 15 // Limit anchors
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
          take: 5 // Limit pricing plans
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
          take: 10 // Limit pricing table entries
        },
        
        nearbyPoints: {
          select: {
            id: true,
            type: true,
            name: true,
            distanceKm: true,
            travelTimeMin: true
          },
          orderBy: [{ type: 'asc' }, { distanceKm: 'asc' }],
          take: 20 // Limit nearby points
        }
      },
    });
    
    if (!project) {
      console.log(`❌ Project with ID/slug ${id} not found`);
      return NextResponse.json({ 
        error: 'Project not found',
        message: 'The requested project could not be found.',
        timestamp: new Date().toISOString()
      }, { status: 404 });
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
          'X-Cache': 'MISS-304',
          'X-Response-Time': (Date.now() - startTime).toString()
        }
      });
    }

    console.log(`✅ Project fetched: ${project.title} (${Date.now() - startTime}ms)`);
    
    return NextResponse.json(project, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'ETag': etag,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString(),
        'X-Project-Id': project.id
      }
    });
  } catch (error) {
    console.error('❌ Get project error:', error);
    const errorResponse = {
      error: 'Failed to fetch project',
      message: 'An error occurred while fetching the project. Please try again.',
      timestamp: new Date().toISOString(),
      queryTime: Date.now() - startTime
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function putProjectHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
    
    // Clear caches for this project
    projectCache.delete(id);
    clearWarmProject(id);
    console.log(`Cleared caches for project: ${id}`);
    
    // Revalidate the project detail page directly
    try {
      revalidatePath(`/projects/${id}`);
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

async function deleteProjectHandler(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.project.delete({ where: { slug: id } });
    // Clear caches and revalidate path after deletion
    projectCache.delete(id);
    clearWarmProject(id);
    try {
      revalidatePath(`/projects/${id}`);
    } catch {}
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// Export wrapped handlers with database retry logic
// Export handlers with proper database connection middleware
export const GET = withDatabaseConnection(getProjectHandler);
export const PUT = withDatabaseConnection(putProjectHandler);
export const DELETE = withDatabaseConnection(deleteProjectHandler);
