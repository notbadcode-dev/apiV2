/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTL_DEFAULT } from '@constant/cache.constant';
import cacheService from '@service/cache.service';
import { LoggerService } from '@service/logger.service';

export function CacheDecorator(ttlSeconds = TTL_DEFAULT): MethodDecorator {
    const LOGGER_SERVICE: LoggerService = new LoggerService();

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const ORIGINAL_METHOD = descriptor.value;
        descriptor.value = async function (...args: any[]): Promise<any> {
            const CACHE_KEY = `${propertyKey.toString()}_${JSON.stringify(args)}`;
            const CACHED_RESULT = cacheService.get(CACHE_KEY);
            if (CACHED_RESULT) {
                LOGGER_SERVICE.infoLogger(`Serving cached result for ${CACHE_KEY}`);
                return CACHED_RESULT;
            }
            LOGGER_SERVICE.infoLogger(`Executing method ${propertyKey.toString()} and caching result for ${CACHE_KEY}`);
            const RESULT = await ORIGINAL_METHOD.apply(this, args);
            cacheService.put(CACHE_KEY, RESULT, ttlSeconds * 1000);
            return RESULT;
        };
    };
}
