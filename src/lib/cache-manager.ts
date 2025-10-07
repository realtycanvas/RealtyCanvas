/**
 * Centralized Cache Manager for Next.js Application
 * Handles in-memory caching with TTL, cleanup, and monitoring
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  etag: string;
  accessCount: number;
  lastAccessed: number;
  key: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  cleanupInterval?: number; // Cleanup interval in milliseconds
}

class CacheManager<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0,
  };

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      cleanupInterval: options.cleanupInterval || 60 * 1000, // 1 minute
    };

    this.startCleanupTimer();
  }

  private startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    let evicted = 0;

    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
        evicted++;
      }
    });

    // If still over max size, remove least recently accessed
    if (this.cache.size > this.options.maxSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

      const toRemove = this.cache.size - this.options.maxSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(sortedEntries[i][0]);
        evicted++;
      }
    }

    this.stats.evictions += evicted;

    if (evicted > 0) {
      console.log(`🧹 Cache cleanup: removed ${evicted} entries, ${this.cache.size} remaining`);
    }
  }

  get(key: string): T | null {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = now;
    
    this.stats.hits++;
    return entry.data;
  }

  set(key: string, data: T, etag?: string): void {
    // Run cleanup before adding new entry
    if (this.cache.size >= this.options.maxSize) {
      this.cleanup();
    }

    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      etag: etag || this.generateETag(data),
      accessCount: 1,
      lastAccessed: now,
      key,
    });
  }

  getWithETag(key: string): { data: T; etag: string } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = now;
    
    return {
      data: entry.data,
      etag: entry.etag,
    };
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
    };
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  getStats() {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests * 100).toFixed(2)
      : '0.00';

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
      maxSize: this.options.maxSize,
      ttl: this.options.ttl,
    };
  }

  private generateETag(data: any): string {
    // Simple ETag generation based on data hash
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(36)}"`;
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Create singleton instances for different cache types
export const projectCache = new CacheManager({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 100,
  cleanupInterval: 60 * 1000, // 1 minute
});

export const generalCache = new CacheManager({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 200,
  cleanupInterval: 2 * 60 * 1000, // 2 minutes
});

// Export the CacheManager class for custom instances
export { CacheManager };

// Graceful shutdown
process.on('SIGTERM', () => {
  projectCache.destroy();
  generalCache.destroy();
});

process.on('SIGINT', () => {
  projectCache.destroy();
  generalCache.destroy();
});