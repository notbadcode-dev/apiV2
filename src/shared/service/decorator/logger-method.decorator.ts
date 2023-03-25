/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerService } from '../logger.service';

export function LoggerMethodDecorator(
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> | undefined {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    // eslint-disable-next-line consistent-return
    descriptor.value = function (...args: any[]): void {
        const req = args[0];
        const ip = req?.ip;
        LoggerService.infoLogger(`Start method ${key} on class ${className} from IP ${ip}`);
        try {
            const result = originalMethod.apply(this, args);
            LoggerService.infoLogger(`End method ${key} on class ${className} from IP ${ip}`);
            return result;
        } catch (error) {
            LoggerService.errorLogger(`Error: ${error} on method ${key}, on class ${className} from IP ${ip}`);
        }
    };
    return descriptor;
}
