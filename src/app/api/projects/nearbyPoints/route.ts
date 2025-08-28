import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type, name, distanceKm, travelTimeMin } = body;

    if (!projectId || !type || !name) {
      return NextResponse.json({ error: 'Missing required fields (projectId, type, name)' }, { status: 400 });
    }

    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const nearbyPoint = await prisma.nearbyPoint.create({
      data: {
        projectId: project.id,
        type,
        name,
        distanceKm: distanceKm || null,
        travelTimeMin: travelTimeMin || null,
      },
    });

    return NextResponse.json(nearbyPoint, { status: 201 });
  } catch (error) {
    console.error('Create nearby point error:', error);
    return NextResponse.json({ error: 'Failed to create nearby point' }, { status: 500 });
  }
}
