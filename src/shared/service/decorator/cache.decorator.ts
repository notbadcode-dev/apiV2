/* eslint-disable @typescript-eslint/no-explicit-any */
import { CACHE_CONSTANT } from '@constant/cache.constant';
import cacheService from '@service/cache.service';
import { LoggerService } from '@service/logger.service';

export function CacheDecorator(ttlSeconds = CACHE_CONSTANT.TTL_DEFAULT): MethodDecorator {
    const LOGGER_SERVICE: LoggerService = new LoggerService();

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const ORIGINAL_METHOD = descriptor.value;
        descriptor.value = async function (...args: any[]): Promise<any> {
            const SERIALIZABLE_ARGUMENTS = args.filter(
                (arg) => typeof arg !== 'object' || !Object.prototype.hasOwnProperty.call(arg, 'propertyToExclude')
            );

            const CONTROLLER_NAME = target.constructor.name;
            const CACHE_KEY = `${CONTROLLER_NAME}_${propertyKey.toString()}_${JSON.stringify(SERIALIZABLE_ARGUMENTS[1])}`;

            const CACHED_RESULT = cacheService.get(CACHE_KEY);
            if (CACHED_RESULT) {
                LOGGER_SERVICE.infoLogger(CACHE_CONSTANT.SERVING_CACHED_RESULT(CACHE_KEY));
                return CACHED_RESULT;
            }

            LOGGER_SERVICE.infoLogger(CACHE_CONSTANT.EXECUTING_AND_CACHING_MESSAGE(propertyKey ?? '', CACHE_KEY));
            const RESULT = await ORIGINAL_METHOD.apply(this, args);
            cacheService.put(CACHE_KEY, RESULT, ttlSeconds * CACHE_CONSTANT.MILLISECONDS_PER_SECOND);

            return RESULT;
        };
    };
}
