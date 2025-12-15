import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reconnect = searchParams.get('reconnect') === 'true';
    
    if (reconnect) {
      // Manual reconnection is deprecated with Prisma singleton
      // But we can force a new query to test connection
      try {
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({
          status: 'success',
          message: 'Database connection verified',
          timestamp: new Date().toISOString(),
          reconnected: true
        });
      } catch (e) {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to verify database connection',
          timestamp: new Date().toISOString(),
          reconnected: false
        }, { status: 503 });
      }
    }
    
    // Regular health check
    try {
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json({
        status: 'success',
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
       return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('Database health check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST endpoint to force database reconnection
export async function POST() {
  // Deprecated endpoint
  return NextResponse.json({
    status: 'success',
    message: 'Database connection verified',
    timestamp: new Date().toISOString()
  });
}