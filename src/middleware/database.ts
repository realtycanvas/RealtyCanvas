import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Database connection middleware
export function withDatabaseConnection<T>(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  maxRetries = 2
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Execute the actual handler directly - Prisma handles connection internally
        return await handler(req, ...args);
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Database operation attempt ${attempt + 1} failed:`, lastError.message);
        
        // Check if it's a database connection error
        const isConnectionError = 
          lastError.message.includes('connection') ||
          lastError.message.includes('timeout') ||
          lastError.message.includes('ECONNREFUSED') ||
          lastError.message.includes('ETIMEDOUT') ||
          lastError.message.includes('P1001') || // Prisma connection error
          lastError.message.includes('P1017'); // Prisma timeout error
        
        if (isConnectionError && attempt < maxRetries) {
          console.log(`Retrying database operation (attempt ${attempt + 2}/${maxRetries + 1})...`);
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        
        // If it's not a connection error or we've exhausted retries, throw the error
        if (attempt === maxRetries) {
          console.error('Database operation failed after all retries:', lastError);
          return NextResponse.json(
            {
              error: 'Database operation failed',
              message: isConnectionError 
                ? 'Database connection lost. Please try again.' 
                : 'An error occurred while processing your request.',
              timestamp: new Date().toISOString(),
            },
            { status: isConnectionError ? 503 : 500 }
          );
        }
      }
    }
    
    // This should never be reached, but just in case
    return NextResponse.json(
      {
        error: 'Unexpected error',
        message: 'An unexpected error occurred.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  };
}

// Helper function to wrap API route handlers
export function withDatabaseRetry<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const wrappedHandler = withDatabaseConnection(handler as any);
    return await wrappedHandler(args[0] as NextRequest, ...args.slice(1));
  };
}

// Connection health monitoring
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

export async function periodicHealthCheck() {
  // Deprecated: Prisma handles connection pooling internally
  return;
}