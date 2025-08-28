import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, question, answer, sortOrder } = body;

    if (!projectId || !question || !answer) {
      return NextResponse.json({ error: 'Missing required fields (projectId, question, answer)' }, { status: 400 });
    }

    // Find the actual project ID using the slug
    const project = await prisma.project.findUnique({
      where: { slug: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const faq = await prisma.faq.create({
      data: {
        projectId: project.id,
        question,
        answer,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
