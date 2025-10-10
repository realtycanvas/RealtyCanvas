import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Get client IP for tracking (optional)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Get today's date for daily aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, totalClicks: true }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update or create daily click record
      await tx.projectClick.upsert({
        where: {
          projectId_clickDate: {
            projectId: id,
            clickDate: today
          }
        },
        update: {
          clickCount: {
            increment: 1
          },
          lastClickAt: new Date(),
          clientIP: clientIP
        },
        create: {
          projectId: id,
          clickCount: 1,
          clickDate: today,
          lastClickAt: new Date(),
          clientIP: clientIP
        }
      });

      // Update total clicks on the project
      await tx.project.update({
        where: { id },
        data: {
          totalClicks: {
            increment: 1
          }
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Click tracked successfully' });
  } catch (error) {
    console.error('Error tracking project click:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}