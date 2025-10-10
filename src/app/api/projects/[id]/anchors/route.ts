import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    await prisma.anchorTenant.deleteMany({ where: { projectId: project.id } });
    return NextResponse.json({ message: 'Anchors deleted' });
  } catch (error) {
    console.error('Delete anchors error:', error);
    return NextResponse.json({ error: 'Failed to delete anchors' }, { status: 500 });
  }
}
