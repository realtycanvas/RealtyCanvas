import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const floorPlans = await prisma.floorPlan.findMany({
      where: { projectId: project.id },
      orderBy: { sortOrder: 'asc' }
    });
    return NextResponse.json(floorPlans);
  } catch (error) {
    console.error('Get floor plans error:', error);
    return NextResponse.json({ error: 'Failed to get floor plans' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.floorPlan.deleteMany({ where: { projectId: project.id } });
    return NextResponse.json({ message: 'Floor plans deleted' });
  } catch (error) {
    console.error('Delete floor plans error:', error);
    return NextResponse.json({ error: 'Failed to delete floor plans' }, { status: 500 });
  }
}
