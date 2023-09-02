export const CACHE_CONSTANT = {
    TTL_1_MINUTE: 60, // 1 MINUTE
    TTL_10_MINUTES: 600, // 10 MINUTE

    TTL_DEFAULT: 60, // 1 MINUTE

    MILLISECONDS_PER_SECOND: 1000, // 1 MINUTE

    SERVING_CACHED_RESULT: (cacheKey: string): string => {
        return `Serving cached result for ${cacheKey}`;
    },
    EXECUTING_AND_CACHING_MESSAGE: (propertyKey: string | symbol, cacheKey: string): string => {
        return `Executing method ${String(propertyKey)} and caching result for ${cacheKey}`;
    },
};
