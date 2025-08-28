import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type, url, caption, tags, floor, sortOrder } = body;

    if (!projectId || !type || !url) {
      return NextResponse.json({ error: 'Missing required fields (projectId, type, url)' }, { status: 400 });
    }

    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const media = await prisma.media.create({
      data: {
        projectId: project.id,
        type,
        url,
        caption: caption || null,
        tags: Array.isArray(tags) ? tags : [],
        floor: floor || null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Create media error:', error);
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}
