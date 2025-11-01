import { unstable_noStore as noStore } from 'next/cache';
import { getWarmProject, setWarmProject } from './project-warm-cache';

type Options = {
  logLabel?: string;
};

export async function withWarmCache<T>(key: string, fetcher: () => Promise<T | null>, opts: Options = {}): Promise<T | null> {
  const label = opts.logLabel ? `:${opts.logLabel}` : '';
  // First attempt (static/normal)
  let data = await fetcher();
  if (data) return data;

  // Try warm cache
  const warm = getWarmProject<T>(key);
  if (warm) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Warm Cache Hit${label}] Using warm data for key: ${key}`);
    }
    return warm;
  }

  // Dynamic fallback only for this request
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[ISR Miss${label}] Data not found statically for key: ${key}`);
  }
  noStore();
  data = await fetcher();
  if (data) {
    setWarmProject(key, data);
  }
  return data;
}