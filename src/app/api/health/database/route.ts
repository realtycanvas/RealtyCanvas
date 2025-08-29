import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection, ensureDatabaseConnection } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reconnect = searchParams.get('reconnect') === 'true';
    
    if (reconnect) {
      console.log('Database reconnection requested...');
      const reconnected = await ensureDatabaseConnection(5);
      
      if (reconnected) {
        return NextResponse.json({
          status: 'success',
          message: 'Database reconnected successfully',
          timestamp: new Date().toISOString(),
          reconnected: true
        });
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to reconnect to database',
          timestamp: new Date().toISOString(),
          reconnected: false
        }, { status: 503 });
      }
    }
    
    // Regular health check
    const health = await checkDatabaseConnection();
    
    if (health.status === 'connected') {
      return NextResponse.json({
        status: 'success',
        message: 'Database connection is healthy',
        timestamp: health.timestamp
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: health.error,
        timestamp: health.timestamp
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
  try {
    console.log('Forcing database reconnection...');
    const reconnected = await ensureDatabaseConnection(5);
    
    if (reconnected) {
      return NextResponse.json({
        status: 'success',
        message: 'Database reconnected successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to reconnect to database',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('Database reconnection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Reconnection failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}