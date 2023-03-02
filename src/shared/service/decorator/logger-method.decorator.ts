import { LoggerService } from '../logger.service';

export function loggerMethod(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | undefined {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    // eslint-disable-next-line consistent-return
    descriptor.value = function (...args: any[]): void {
        LoggerService.infoLogger(`Start method ${key} on class ${className}`);
        try {
            const result = originalMethod.apply(this, args);
            LoggerService.infoLogger(`End method ${key} on class ${className}`);
            return result;
        } catch (error) {
            LoggerService.errorLogger(`Error in method ${key}: ${error}, on class ${className}`);
        }
    };
    return descriptor;
}
