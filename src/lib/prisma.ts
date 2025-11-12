import { PrismaClient } from '@prisma/client';

// Import connection monitor only
import './connection-monitor';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma configuration with connection pooling and timeouts
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Graceful shutdown handling
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
});

// Connection health check function
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Database connection check failed:', error);
    return { status: 'disconnected', error: error instanceof Error ? error.message : String(error), timestamp: new Date().toISOString() };
  }
}

// Auto-reconnection with retry logic
export async function ensureDatabaseConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const health = await checkDatabaseConnection();
      if (health.status === 'connected') {
        return true;
      }
    } catch (error) {
      console.warn(`Database connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  console.error('Failed to establish database connection after', retries, 'attempts');
  return false;
}

// Optional: enable per-query timing logs for Prisma operations.
// This is helpful for diagnosing slow queries in production when LOG_QUERY_TIMES=1,
// and is always enabled in development.
let timingEnabled = false;
export function enableQueryTiming() {
  if (timingEnabled) return;
  prisma.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;
    if (process.env.LOG_QUERY_TIMES === '1' || process.env.NODE_ENV === 'development') {
      const model = (params as any).model || 'raw';
      const action = (params as any).action || 'unknown';
      console.log(`⏱️ Prisma ${model}.${action} took ${duration}ms`);
    }
    return result;
  });
  timingEnabled = true;
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;