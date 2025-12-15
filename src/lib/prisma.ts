import { PrismaClient } from '@prisma/client';

// Import connection monitor only
import './connection-monitor';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enhanced Prisma configuration with connection pooling and timeouts
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

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

// Optional: enable per-query timing logs for Prisma operations.
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
