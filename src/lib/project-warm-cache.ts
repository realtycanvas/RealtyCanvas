const WARM_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEntry<T> = { data: T; timestamp: number };

const warmCache = new Map<string, CacheEntry<any>>();

export function getWarmProject<T = any>(slug: string): T | null {
  const entry = warmCache.get(slug);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > WARM_TTL_MS) {
    warmCache.delete(slug);
    return null;
  }
  return entry.data as T;
}

export function setWarmProject<T = any>(slug: string, data: T): void {
  warmCache.set(slug, { data, timestamp: Date.now() });
}

export function clearWarmProject(slug: string): void {
  warmCache.delete(slug);
}