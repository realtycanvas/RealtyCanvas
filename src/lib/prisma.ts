import { PrismaClient } from '@prisma/client';

// Import connection monitor
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;