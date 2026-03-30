import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/app/generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const sort = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
    const skip = (page - 1) * limit;
    const search = searchParams.get('search')?.trim() || '';
    const archivedOnly = searchParams.get('archivedOnly') === '1';

    const where: Prisma.LeadWhereInput = {};
    where.status = archivedOnly ? 'ARCHIVED' : { not: 'ARCHIVED' };
    if (search.length >= 2) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { projectTitle: { contains: search, mode: 'insensitive' } },
        { projectSlug: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rows, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sort },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          timeline: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({
      data: rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.timeline || null,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error('[LEADS] Failed to fetch leads', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const permanent = Boolean(body?.permanent);

    if (!id) {
      return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
    }

    if (permanent) {
      await prisma.lead.delete({ where: { id } });
    } else {
      await prisma.lead.update({ where: { id }, data: { status: 'ARCHIVED' } });
    }

    return NextResponse.json({ ok: true, permanent });
  } catch (error) {
    console.error('[LEADS] Failed to delete lead', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
