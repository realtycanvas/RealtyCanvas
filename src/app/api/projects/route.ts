import { NextRequest, NextResponse } from 'next/server';
import { prisma, enableQueryTiming } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { databaseWarmup } from '@/lib/database-warmup';
import { createHash } from 'crypto';
import { parseIndianPriceToNumber, isPriceWithinRange } from '@/lib/price';
import { unstable_cache } from 'next/cache';

// Use unstable_cache for database queries to improve performance and reduce DB load
const getCachedProjects = unstable_cache(
  async (page: number, limit: number, whereClause: any) => {
    const skip = (page - 1) * limit;
    
    // Execute query and count in parallel
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
          basePrice: true,
          minRatePsf: true,
          maxRatePsf: true,
          developerName: true,
          locality: true,
        },
      }),
      prisma.project.count({ where: whereClause })
    ]);

    return { projects, totalCount };
  },
  ['projects-api-list'],
  { revalidate: 60, tags: ['projects'] }
);

// Simple in-memory cache for better performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 90000; // 90 seconds

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  // Enable detailed Prisma timing (dev-only by default, or LOG_QUERY_TIMES=1 in prod)
  enableQueryTiming();
  
  try {
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
    const minBudget = minPrice ? parseFloat(minPrice) : null;
    const maxBudget = maxPrice ? parseFloat(maxPrice) : null;
    const isBudgetFilterActive = (minBudget !== null && !isNaN(minBudget)) || (maxBudget !== null && !isNaN(maxBudget));
    
    // Create cache key (must be available before warmup/connection checks)
    const cacheKey = createHash('md5')
      .update(`projects:${page}:${search}:${category}:${status}:${city}:${state}:${minPrice}:${maxPrice}`)
      .digest('hex');
    
    // Ensure database is warmed up and ready; if not, serve warm cache if available
    // Warmup check removed to allow Prisma to handle connections natively
    // const isReady = await databaseWarmup.ensureReady();
    // if (!isReady) { ... }
    
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
    
    // NOTE: Budget filter will be applied server-side using parsed basePrice.
    // We intentionally DO NOT add DB conditions here because basePrice is stored as text.
    
    // Combine conditions
    if (conditions.length > 0) {
      whereClause.AND = conditions;
    }

    let responseData: any;

    // Check if we can use the cached fetcher (basic pagination only)
    // Complex filters might blow up cache storage, so we only cache the "main" views
    const isBasicList = !search && !category && !status && !city && !state && !isBudgetFilterActive;

    if (isBasicList) {
      const result = await getCachedProjects(page, limit, whereClause);
      const { projects, totalCount } = result;

      const totalPages = Math.ceil(totalCount / limit);
      const hasMore = page < totalPages;

      responseData = {
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
          cached: true,
          listMs: 0,
          countMs: 0,
        }
      };
    } else if (isBudgetFilterActive) {
      // Fetch a larger set then filter by parsed basePrice in memory.
      // Cap to a safe upper bound to avoid heavy queries.
      // Prefer DB-side filtering when numeric price columns exist (priceMin/priceMax)
      // Try DB-side filtering with raw SQL if priceMin/priceMax exist
      try {
        const cols = await prisma.$queryRaw<{ column_name: string }[]>`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'Project' AND column_name IN ('priceMin', 'priceMax')
        `;
        const hasMin = cols.some(c => c.column_name === 'priceMin');
        const hasMax = cols.some(c => c.column_name === 'priceMax');

        if (hasMin) {
          const conditions: Prisma.Sql[] = [];
          // Map whereClause conditions into raw SQL
          if (search && search.length >= 2) {
            conditions.push(Prisma.sql`(
              LOWER("title") LIKE LOWER(${`%${search}%`}) OR
              LOWER("subtitle") LIKE LOWER(${`%${search}%`}) OR
              LOWER("address") LIKE LOWER(${`%${search}%`}) OR
              LOWER("city") LIKE LOWER(${`%${search}%`}) OR
              LOWER("state") LIKE LOWER(${`%${search}%`})
            )`);
          }
          if (category && category !== 'ALL' && category !== 'All Categories') {
            conditions.push(Prisma.sql`"category" = ${category}`);
          }
          if (status && status !== 'ALL' && status !== 'All Status') {
            conditions.push(Prisma.sql`"status" = ${status}`);
          }
          if (city) {
            conditions.push(Prisma.sql`LOWER("city") = LOWER(${city})`);
          }
          if (state) {
            conditions.push(Prisma.sql`LOWER("state") = LOWER(${state})`);
          }

          // Budget overlap conditions
          if (minBudget !== null && !isNaN(minBudget) && maxBudget !== null && !isNaN(maxBudget)) {
            // overlap: priceMin <= max && (priceMax is null OR priceMax >= min)
            conditions.push(
              hasMax
                ? Prisma.sql`("priceMin" <= ${maxBudget} AND ("priceMax" IS NULL OR "priceMax" >= ${minBudget}))`
                : Prisma.sql`("priceMin" <= ${maxBudget})`
            );
          } else if (minBudget !== null && !isNaN(minBudget)) {
            conditions.push(
              hasMax
                ? Prisma.sql`("priceMax" IS NULL OR "priceMax" >= ${minBudget})`
                : Prisma.sql`("priceMin" >= ${minBudget})`
            );
          } else if (maxBudget !== null && !isNaN(maxBudget)) {
            conditions.push(Prisma.sql`"priceMin" <= ${maxBudget}`);
          }

          // Build WHERE clause without Prisma.join to satisfy TS type constraints
          let whereSql = Prisma.sql``;
          if (conditions.length) {
            whereSql = Prisma.sql`WHERE `;
            for (let i = 0; i < conditions.length; i++) {
              whereSql = i === 0
                ? Prisma.sql`${whereSql}${conditions[i]}`
                : Prisma.sql`${whereSql} AND ${conditions[i]}`;
            }
          }

          const dbStart = Date.now();
          const listQuery = Prisma.sql`
            SELECT id, slug, title, subtitle, category, status, address, city, state,
                   "featuredImage", "createdAt", "updatedAt", basePrice,
                   "minRatePsf", "maxRatePsf", "developerName", locality
            FROM "Project"
            ${whereSql}
            ORDER BY status ASC, "updatedAt" DESC
            LIMIT ${limit} OFFSET ${skip}
          `;
          const countQuery = Prisma.sql`
            SELECT COUNT(*)::int AS count
            FROM "Project"
            ${whereSql}
          `;

          const projects = await prisma.$queryRaw<any[]>(listQuery);
          const countRows = await prisma.$queryRaw<{ count: number }[]>(countQuery);
          const totalCount = countRows[0]?.count || 0;
          const dbMs = Date.now() - dbStart;

          const totalPages = Math.ceil(totalCount / limit);
          const hasMore = page < totalPages;

          responseData = {
            projects,
            pagination: {
              page,
              limit,
              totalCount,
              totalPages,
              hasMore,
              hasPrevious: page > 1,
            },
            meta: {
              queryTime: Date.now() - startTime,
              cached: false,
              budgetFilterApplied: true,
              dbScanMs: dbMs,
              filterMs: 0,
            },
          };
        } else {
          // Columns missing -> fallback to scan
          throw new Error('priceMin column missing');
        }
      } catch (e) {
        // Fallback to in-memory scan if DB columns are missing or any error occurs
        console.warn('Budget DB filter unavailable; falling back to scan:', e);
        const MAX_SCAN = 1000;
        const scanStart = Date.now();
        const allCandidates = await prisma.project.findMany({
          where: whereClause,
          orderBy: [
            { status: 'asc' },
            { updatedAt: 'desc' },
          ],
          take: MAX_SCAN,
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
            basePrice: true,
            minRatePsf: true,
            maxRatePsf: true,
            developerName: true,
            locality: true,
          },
        });
        const scanMs = Date.now() - scanStart;

        const filterStart = Date.now();
        const filtered = allCandidates.filter((p) =>
          isPriceWithinRange(parseIndianPriceToNumber((p as any).basePrice), minBudget, maxBudget)
        );
        const filterMs = Date.now() - filterStart;

        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / limit);
        const hasMore = page < totalPages;
        const paged = filtered.slice(skip, skip + limit);

        responseData = {
          projects: paged,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasMore,
            hasPrevious: page > 1,
          },
          meta: {
            queryTime: Date.now() - startTime,
            cached: false,
            budgetFilterApplied: true,
            dbScanMs: scanMs,
            filterMs,
          },
        };
      }
    } else {
      // Existing path: normal DB pagination without budget filter
      const listStart = Date.now();
      const projects = await prisma.project.findMany({
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
          basePrice: true,
          minRatePsf: true,
          maxRatePsf: true,
          developerName: true,
          locality: true,
        },
      });
      const listMs = Date.now() - listStart;
      const countStart = Date.now();
      const totalCount = await prisma.project.count({ where: whereClause });
      const countMs = Date.now() - countStart;

      const totalPages = Math.ceil(totalCount / limit);
      const hasMore = page < totalPages;

      responseData = {
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
          cached: false,
          listMs,
          countMs,
        }
      };
    }

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
    
    // Log summary (avoid referencing variables outside scope)
    console.log(`✅ Projects response ready (${Date.now() - startTime}ms)`);

    const etag = createHash('md5').update(JSON.stringify(responseData)).digest('hex');
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=120',
        'ETag': etag,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString(),
        // Prefer listMs+countMs when available; otherwise fall back to meta.queryTime
        'X-DB-Time': (
          (responseData?.meta?.listMs || 0) +
          (responseData?.meta?.countMs || 0) +
          (responseData?.meta?.dbScanMs || 0)
        ).toString(),
      }
    });
    
  } catch (error: any) {
    console.error('Prisma error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    // Attempt 1: Serve any cached response
    try {
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = 6;
      const search = searchParams.get('search')?.trim() || '';
      const category = searchParams.get('category') || '';
      const status = searchParams.get('status') || '';
      const city = searchParams.get('city')?.trim() || '';
      const state = searchParams.get('state')?.trim() || '';
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const cacheKey = createHash('md5')
        .update(`projects:${page}:${search}:${category}:${status}:${city}:${state}:${minPrice}:${maxPrice}`)
        .digest('hex');
      const cachedErr = cache.get(cacheKey);
      if (cachedErr && (Date.now() - cachedErr.timestamp) < CACHE_TTL) {
        const etag = createHash('md5').update(JSON.stringify(cachedErr.data)).digest('hex');
        return NextResponse.json(cachedErr.data, {
          headers: {
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=180',
            'ETag': etag,
            'X-Cache': 'HIT',
            'X-Fallback': 'error'
          }
        });
      }
    } catch {}

    // Attempt 2: Serve static fallback data
    console.warn('Serving static fallback due to API error');
    let fallbackProjects: any[] = [];
    try {
      const fallbackModule = await import('@/data/fallback-projects.json');
      fallbackProjects = fallbackModule.default || fallbackModule;
    } catch (importError) {
      console.error('Failed to load fallback projects:', importError);
      // Minimal fallback if even the file fails
      fallbackProjects = []; 
    }

    return NextResponse.json({
      projects: fallbackProjects,
      pagination: { page: 1, limit: 6, totalCount: fallbackProjects.length, totalPages: 1, hasMore: false },
      meta: { queryTime: Date.now() - startTime, cached: false, fallback: true }
    }, {
      headers: {
        'X-Fallback': 'static',
        'Cache-Control': 'public, max-age=60'
      }
    });
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
    // const isConnected = await ensureDatabaseConnection(2);
    // if (!isConnected) {
    //   console.error('❌ Database connection failed for project creation');
    //   return NextResponse.json({
    //     error: 'Database connection error. Please try again.',
    //     details: 'Connection could not be established'
    //   }, { status: 503 });
    // }

    const body = await request.json();

    // Helper to normalize slugs similar to import route
    const slugify = (input: string) => input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const ensureUniqueSlug = async (base: string) => {
      let candidate = base || 'project';
      for (let i = 0; i < 5; i++) {
        const exists = await prisma.project.findFirst({ where: { slug: candidate }, select: { id: true } });
        if (!exists) return candidate;
        const suffix = Math.random().toString(36).slice(2, 6);
        candidate = `${base}-${suffix}`;
      }
      return `${base}-${Date.now().toString(36)}`;
    };

    console.log('📝 Creating new project:', body.title || 'Untitled');

    const baseTitle = (body.title || '').toString();
    const providedSlug = (body.slug || baseTitle).toString();
    const normalizedSlug = slugify(providedSlug);
    const finalSlug = await ensureUniqueSlug(normalizedSlug);

    const project = await prisma.project.create({
      data: {
        ...body,
        slug: finalSlug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Clear cache when new project is created
    cache.clear();
    console.log(`✅ Project created successfully: ${project.id} (${Date.now() - startTime}ms)`);

    // Trigger revalidation so the new project page is immediately available
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: `/projects/${project.slug}` })
      });
      console.log(`Triggered revalidation for /projects/${project.slug}`);
    } catch (revalidateError) {
      console.warn('Failed to trigger revalidation for new project:', revalidateError);
    }

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
