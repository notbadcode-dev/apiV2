import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import { LoggerService } from '@service/logger.service';

const loggerService: LoggerService = new LoggerService();
const globalUtilEnvService: GlobalUtilEnvService = new GlobalUtilEnvService();

/* eslint-disable @typescript-eslint/no-explicit-any */
export function LoggerMethodDecorator(
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> | undefined {
    const loggerService: LoggerService = new LoggerService();
    const loggingEnabled: boolean = globalUtilEnvService.getLoggingEnabled();

    if (!loggingEnabled) {
        return descriptor;
    }

    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    // eslint-disable-next-line consistent-return
    descriptor.value = function (...args: any[]): void {
        const req = args[0];
        const ip = req?.ip;

        startMethod(key, className, ip);

        try {
            const result = originalMethod.apply(this, args);
            endMethod(key, className, ip);
            loggerService.infoLogger(`End method ${key} on class ${className} from IP ${ip}`);
            return result;
        } catch (error) {
            errorOnMethod(error + '', key, className, ip);
        }
    };
    return descriptor;
}

function startMethod(key: string, className: string, ip?: string): void {
    const message = addFromIp(`Start method ${key} on class ${className}`, ip);
    loggerService.infoLogger(message);
}

function endMethod(key: string, className: string, ip?: string): void {
    const message = addFromIp(`End method ${key} on class ${className}`, ip);
    loggerService.infoLogger(message);
}

function errorOnMethod(error: string, key: string, className: string, ip?: string): void {
    const message = addFromIp(`Error: ${error} on method ${key}, on class ${className}`, ip);
    loggerService.infoLogger(message);
}

function addFromIp(message: string, ip?: string): string {
    if (ip) {
        message += ` from IP ${ip}`;
    }
    message += '.';

    return message;
}
