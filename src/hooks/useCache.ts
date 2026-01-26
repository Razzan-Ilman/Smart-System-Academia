import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Custom hook for caching API responses
 * @param key - Unique cache key
 * @param fetcher - Function that fetches the data
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns { data, loading, error, refetch }
 */
export function useCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (skipCache = false) => {
        try {
            setLoading(true);
            setError(null);

            // Check cache first
            if (!skipCache) {
                const cached = cache.get(key);
                if (cached && Date.now() - cached.timestamp < ttl) {
                    setData(cached.data);
                    setLoading(false);
                    return;
                }
            }

            // Fetch fresh data
            const result = await fetcher();

            // Update cache
            cache.set(key, {
                data: result,
                timestamp: Date.now(),
            });

            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [key, fetcher, ttl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        return fetchData(true);
    }, [fetchData]);

    return { data, loading, error, refetch };
}

/**
 * Invalidate cache for a specific key
 */
export function invalidateCache(key: string) {
    cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
    cache.clear();
}
