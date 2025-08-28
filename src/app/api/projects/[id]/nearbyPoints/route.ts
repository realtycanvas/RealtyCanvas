import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const nearbyPoints = await prisma.nearbyPoint.findMany({
      where: { projectId: id }
    });
    return NextResponse.json(nearbyPoints);
  } catch (error) {
    console.error('Get nearby points error:', error);
    return NextResponse.json({ error: 'Failed to get nearby points' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.nearbyPoint.deleteMany({ where: { projectId: id } });
    return NextResponse.json({ message: 'Nearby points deleted' });
  } catch (error) {
    console.error('Delete nearby points error:', error);
    return NextResponse.json({ error: 'Failed to delete nearby points' }, { status: 500 });
  }
}
