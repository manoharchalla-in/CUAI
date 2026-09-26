interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryTtlCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Set a cached key with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds = 60): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Get cached item if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  /**
   * Fetch with cache-aside pattern: returns cached data or calls fetchFn
   */
  async wrap<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 60): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }
    const fresh = await fetchFn();
    this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  /**
   * Delete specific key or invalidate by prefix
   */
  invalidate(keyOrPrefix: string): void {
    if (this.cache.has(keyOrPrefix)) {
      this.cache.delete(keyOrPrefix);
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }
}

export const globalCache = new MemoryTtlCache();
