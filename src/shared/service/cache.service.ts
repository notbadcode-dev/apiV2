import cache from 'memory-cache';
import { LoggerMethodDecorator } from './decorator/logger-method.decorator';

export class CacheService {
    private static instance: CacheService;

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
}

export default CacheService.getInstance();
