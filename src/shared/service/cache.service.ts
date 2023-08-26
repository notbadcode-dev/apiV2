import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import cache from 'memory-cache';

export class CacheService {
    //#region Attributes

    private static instance: CacheService;

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }

        return CacheService.instance;
    }

    @LoggerMethodDecorator
    public put<T>(key: string, value: T, duration: number): void {
        cache.put(key, value, duration * 1000);
    }

    @LoggerMethodDecorator
    public get<T>(key: string): T {
        return cache.get(key);
    }

    @LoggerMethodDecorator
    public del(key: string): void {
        cache.del(key);
    }

    @LoggerMethodDecorator
    public clear(): void {
        cache.clear();
    }

    //#endregion
}

export default CacheService.getInstance();
