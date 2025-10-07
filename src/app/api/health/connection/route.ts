import { NextRequest, NextResponse } from 'next/server';
import { getConnectionHealth } from '@/lib/connection-monitor';

/**
 * GET /api/health/connection
 * Returns detailed connection health metrics for monitoring
 */
export async function GET(request: NextRequest) {
  try {
    const metrics = getConnectionHealth();
    
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      connection: metrics,
    }, {
      status: metrics.isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error getting connection health:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get connection health',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}