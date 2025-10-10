import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDatabaseConnection } from '@/lib/prisma';
import { databaseWarmup } from '@/lib/database-warmup';
import { createHash } from 'crypto';

// Simple in-memory cache for better performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 90000; // 90 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Ensure database is warmed up and ready
    const isReady = await databaseWarmup.ensureReady();
    if (!isReady) {
      console.error('❌ Database warmup failed');
      return NextResponse.json({
        error: 'Database service is initializing. Please try again in a moment.',
        projects: [],
        pagination: { page: 1, limit: 6, totalCount: 0, totalPages: 0, hasMore: false }
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse parameters with defaults optimized for 6 projects per page
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = 6; // Fixed to 6 projects per page for optimal UX
    const skip = (page - 1) * limit;
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const city = searchParams.get('city')?.trim() || '';
    const state = searchParams.get('state')?.trim() || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Create cache key
    const cacheKey = createHash('md5')
      .update(`projects:${page}:${search}:${category}:${status}:${city}:${state}:${minPrice}:${maxPrice}`)
      .digest('hex');
    
    // Check cache with ETag support
    const cached = cache.get(cacheKey);
    const ifNoneMatch = request.headers.get('if-none-match');
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`✅ Cache HIT for projects (${Date.now() - startTime}ms)`);
      const etag = createHash('md5').update(JSON.stringify(cached.data)).digest('hex');
      if (ifNoneMatch === etag) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
            'ETag': etag,
          },
        });
      }
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
          'ETag': etag,
          'X-Cache': 'HIT'
        }
      });
    }

    // Ensure database connection
    const isConnected = await ensureDatabaseConnection(2);
    if (!isConnected) {
      return NextResponse.json({
        error: 'Database unavailable',
        projects: [],
        pagination: { page, limit, totalCount: 0, totalPages: 0, hasMore: false }
      }, { status: 503 });
    }
    
    console.log(`🔍 Fetching projects from DB (page=${page}, limit=${limit})`);
    
    // Build optimized where clause
    const whereClause: any = {};
    const conditions: any[] = [];
    
    // Search functionality
    if (search && search.length >= 2) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } }
        ]
      });
    }
    
    // Category filter
    if (category && category !== 'ALL' && category !== 'All Categories') {
      conditions.push({ category: category });
    }
    
    // Status filter
    if (status && status !== 'ALL' && status !== 'All Status') {
      conditions.push({ status: status });
    }
    
    // Location filters
    if (city) {
      conditions.push({ city: { equals: city, mode: 'insensitive' } });
    }
    
    if (state) {
      conditions.push({ state: { equals: state, mode: 'insensitive' } });
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      const priceConditions = [];
      
      if (minPrice) {
        const minPriceNum = parseFloat(minPrice);
        if (!isNaN(minPriceNum)) {
          priceConditions.push({
            OR: [
              { minRatePsf: { gte: minPriceNum.toString() } },
              { maxRatePsf: { gte: minPriceNum.toString() } }
            ]
          });
        }
      }
      
      if (maxPrice) {
        const maxPriceNum = parseFloat(maxPrice);
        if (!isNaN(maxPriceNum)) {
          priceConditions.push({
            OR: [
              { minRatePsf: { lte: maxPriceNum.toString() } },
              { maxRatePsf: { lte: maxPriceNum.toString() } }
            ]
          });
        }
      }
      
      if (priceConditions.length > 0) {
        conditions.push(...priceConditions);
      }
    }
    
    // Combine conditions
    if (conditions.length > 0) {
      whereClause.AND = conditions;
    }

    // Execute optimized parallel queries
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        orderBy: [
          { status: 'asc' }, // Active projects first
          { updatedAt: 'desc' }
        ],
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
          createdAt: true,
          updatedAt: true,
          minRatePsf: true,
          maxRatePsf: true,
          developerName: true,
          locality: true,
        },
      }),
      prisma.project.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    const responseData = {
      projects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
        hasPrevious: page > 1
      },
      meta: {
        queryTime: Date.now() - startTime,
        cached: false
      }
    };

    // Cache the response
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    // Clean old cache entries
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }
    
    console.log(`✅ Projects fetched: ${projects.length}/${totalCount} (${Date.now() - startTime}ms)`);

    const etag = createHash('md5').update(JSON.stringify(responseData)).digest('hex');
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
        'ETag': etag,
        'X-Cache': 'MISS'
      }
    });
    
  } catch (error) {
    console.error('❌ Projects API error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch projects',
      projects: [],
      pagination: { page: 1, limit: 6, totalCount: 0, totalPages: 0, hasMore: false },
      meta: { queryTime: Date.now() - startTime, cached: false }
    }, { status: 500 });
  }
}

// POST method for creating projects (admin only)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Ensure database is warmed up and ready
    const isReady = await databaseWarmup.ensureReady();
    if (!isReady) {
      console.error('❌ Database not ready for project creation');
      return NextResponse.json({
        error: 'Database service is initializing. Please try again in a moment.',
        details: 'Service temporarily unavailable'
      }, { status: 503 });
    }

    // Double-check with connection test
    const isConnected = await ensureDatabaseConnection(2);
    if (!isConnected) {
      console.error('❌ Database connection failed for project creation');
      return NextResponse.json({
        error: 'Database connection error. Please try again.',
        details: 'Connection could not be established'
      }, { status: 503 });
    }

    const body = await request.json();
    
    console.log('📝 Creating new project:', body.title || 'Untitled');
    
    const project = await prisma.project.create({
      data: {
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Clear cache when new project is created
    cache.clear();
    console.log(`✅ Project created successfully: ${project.id} (${Date.now() - startTime}ms)`);
    
    return NextResponse.json(project, { status: 201 });
    
  } catch (error) {
    console.error('❌ Create project error:', error);
    
    // Check if it's a database connection error
    if (error instanceof Error && (
      error.message.includes('connection') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    )) {
      return NextResponse.json({
        error: 'Database connection error. Please try again.',
        details: 'Service temporarily unavailable'
      }, { status: 503 });
    }
    
    // Generic error for other issues
    return NextResponse.json({
      error: 'Failed to create project',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
