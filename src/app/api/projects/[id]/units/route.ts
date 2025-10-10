import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    console.log(`Fetching units for project ${id}, page ${page}, limit ${limit}`);
    
    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get units with pagination
    const [units, totalCount] = await Promise.all([
      prisma.unit.findMany({
        where: { projectId: project.id },
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
        skip,
        take: limit
      }),
      prisma.unit.count({
        where: { projectId: project.id }
      })
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    
    console.log(`Fetched ${units.length} units, total: ${totalCount}, page ${page}/${totalPages}`);
    
    return NextResponse.json({
      units,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'X-Response-Time': Date.now().toString()
      }
    });
  } catch (error) {
    console.error('List units error:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const {
      unitNumber,
      type,
      floor,
      areaSqFt,
      frontageFt,
      ceilingHeightFt,
      fitOutStatus,
      nearAnchor = false,
      isCorner = false,
      visibilityScore,
      ventilationReady,
      priceTotal,
      ratePsf,
      leaseModel,
      lockInMonths,
      escalationPct,
      availability = 'AVAILABLE',
      notes,
      configurationId,
    } = body || {};

    if (!unitNumber || !type || !floor || !areaSqFt) {
      return NextResponse.json({ error: 'Missing required fields (unitNumber, type, floor, areaSqFt)' }, { status: 400 });
    }

    const unit = await prisma.unit.create({
      data: {
        projectId: project.id,
        configurationId: configurationId || null,
        unitNumber,
        type,
        floor,
        areaSqFt: areaSqFt.toString(),
        frontageFt: typeof frontageFt === 'number' ? frontageFt : null,
        ceilingHeightFt: typeof ceilingHeightFt === 'number' ? ceilingHeightFt : null,
        fitOutStatus: fitOutStatus || null,
        nearAnchor,
        isCorner,
        visibilityScore: typeof visibilityScore === 'number' ? visibilityScore : null,
        ventilationReady: typeof ventilationReady === 'boolean' ? ventilationReady : null,
        priceTotal: typeof priceTotal === 'number' ? priceTotal : null,
        ratePsf: typeof ratePsf === 'number' ? ratePsf : null,
        leaseModel: leaseModel || null,
        lockInMonths: typeof lockInMonths === 'number' ? lockInMonths : null,
        escalationPct: typeof escalationPct === 'number' ? escalationPct : null,
        availability,
        notes: notes || null,
      },
    });

    return NextResponse.json(unit, { status: 201 });
  } catch (error) {
    console.error('Create unit error:', error);
    return NextResponse.json({ error: 'Failed to create unit' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.unit.deleteMany({ where: { projectId: project.id } });
    return NextResponse.json({ message: 'Units deleted' });
  } catch (error) {
    console.error('Delete units error:', error);
    return NextResponse.json({ error: 'Failed to delete units' }, { status: 500 });
  }
}