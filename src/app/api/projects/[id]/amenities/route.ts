import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    await prisma.amenity.deleteMany({ where: { projectId: project.id } });
    return NextResponse.json({ message: 'Amenities deleted' });
  } catch (error) {
    console.error('Delete amenities error:', error);
    return NextResponse.json({ error: 'Failed to delete amenities' }, { status: 500 });
  }
}
