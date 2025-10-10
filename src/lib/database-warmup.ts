import { PrismaClient } from '@prisma/client';

// Create a separate Prisma instance for warmup to avoid circular dependency
const warmupPrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Database warmup utility to establish connections on server start
export class DatabaseWarmup {
  private static instance: DatabaseWarmup;
  private isWarmedUp = false;
  private warmupPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): DatabaseWarmup {
    if (!DatabaseWarmup.instance) {
      DatabaseWarmup.instance = new DatabaseWarmup();
    }
    return DatabaseWarmup.instance;
  }

  async warmup(): Promise<boolean> {
    if (this.isWarmedUp) {
      return true;
    }

    if (this.warmupPromise) {
      return this.warmupPromise;
    }

    this.warmupPromise = this.performWarmup();
    return this.warmupPromise;
  }

  private async performWarmup(): Promise<boolean> {
    console.log('🔥 Starting database warmup...');
    const startTime = Date.now();

    try {
      // Test basic connection
      await warmupPrisma.$queryRaw`SELECT 1 as warmup_test`;
      
      // Warm up common queries
      await Promise.all([
        // Count projects (common query)
        warmupPrisma.project.count().catch(() => 0),
        
        // Test connection pool
        warmupPrisma.$queryRaw`SELECT current_database(), current_user, version()`.catch(() => null),
      ]);

      this.isWarmedUp = true;
      const duration = Date.now() - startTime;
      console.log(`✅ Database warmup completed in ${duration}ms`);

      // IMPORTANT: Disconnect warmup client so it doesn't hold a connection
      try {
        await warmupPrisma.$disconnect();
        console.log('🔌 Warmup Prisma client disconnected');
      } catch (disconnectError) {
        console.warn('Warmup disconnect warning:', disconnectError);
      }
      return true;

    } catch (error) {
      console.error('❌ Database warmup failed:', error);
      // Ensure we disconnect on failure as well
      try {
        await warmupPrisma.$disconnect();
      } catch {}
      this.warmupPromise = null; // Reset so it can be retried
      return false;
    }
  }

  isReady(): boolean {
    return this.isWarmedUp;
  }

  async ensureReady(): Promise<boolean> {
    if (this.isWarmedUp) {
      return true;
    }
    return this.warmup();
  }
}

// Export singleton instance
export const databaseWarmup = DatabaseWarmup.getInstance();

// Note: Auto-warmup removed to prevent initialization issues
// API routes should call databaseWarmup.ensureReady() explicitly