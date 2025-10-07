import { NextRequest, NextResponse } from 'next/server';
import { projectCache, generalCache } from '@/lib/cache-manager';

/**
 * GET /api/debug/cache
 * Returns cache statistics and health information for debugging
 */
export async function GET(request: NextRequest) {
  try {
    const stats = {
      timestamp: new Date().toISOString(),
      projectCache: projectCache.getStats(),
      generalCache: generalCache.getStats(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss,
      },
    };

    return NextResponse.json({
      status: 'success',
      data: stats,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error getting cache stats:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get cache statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}

/**
 * DELETE /api/debug/cache
 * Clears all caches for debugging purposes
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const cacheType = url.searchParams.get('type');

    if (cacheType === 'project') {
      projectCache.clear();
      return NextResponse.json({
        status: 'success',
        message: 'Project cache cleared',
        timestamp: new Date().toISOString(),
      });
    } else if (cacheType === 'general') {
      generalCache.clear();
      return NextResponse.json({
        status: 'success',
        message: 'General cache cleared',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Clear all caches
      projectCache.clear();
      generalCache.clear();
      
      return NextResponse.json({
        status: 'success',
        message: 'All caches cleared',
        timestamp: new Date().toISOString(),
      });
    }
    
  } catch (error) {
    console.error('Error clearing cache:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to clear cache',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}