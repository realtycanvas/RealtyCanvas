import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, label, icon } = body;

    if (!projectId || !label) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const highlight = await prisma.highlight.create({
      data: {
        projectId: project.id,
        label,
        icon: icon || null,
      },
    });

    return NextResponse.json(highlight, { status: 201 });
  } catch (error) {
    console.error('Create highlight error:', error);
    return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 });
  }
}
