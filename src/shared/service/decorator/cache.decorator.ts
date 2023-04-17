/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTL_DEFAULT } from '@constant/cache.constant';
import cacheService from '@service/cache.service';
import { LoggerService } from '@service/logger.service';

export function CacheDecorator(ttlSeconds = TTL_DEFAULT): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]): Promise<any> {
            const cacheKey = `${propertyKey.toString()}_${JSON.stringify(args)}`;
            const cachedResult = cacheService.get(cacheKey);
            if (cachedResult) {
                LoggerService.infoLogger(`Serving cached result for ${cacheKey}`);
                return cachedResult;
            }
            LoggerService.infoLogger(`Executing method ${propertyKey.toString()} and caching result for ${cacheKey}`);
            const result = await originalMethod.apply(this, args);
            cacheService.put(cacheKey, result, ttlSeconds * 1000);
            return result;
        };
    };
}
