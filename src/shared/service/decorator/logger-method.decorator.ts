import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import { LoggerService } from '@service/logger.service';

const LOGGER_SERVICE: LoggerService = new LoggerService();
const GLOBAL_UTIL_ENVIRONMENT_SERVICE: GlobalUtilEnvService = new GlobalUtilEnvService();

function addFromIp(message: string, ip?: string): string {
    if (ip) {
        message += ` from IP ${ip}`;
    }
    message += '.';

    return message;
}

function startMethod(key: string, className: string, ip?: string): void {
    const MESSAGE = addFromIp(`Start method ${key} on class ${className}`, ip);
    LOGGER_SERVICE.infoLogger(MESSAGE);
}

function endMethod(key: string, className: string, ip?: string): void {
    const MESSAGE = addFromIp(`End method ${key} on class ${className}`, ip);
    LOGGER_SERVICE.infoLogger(MESSAGE);
}

function errorOnMethod(error: string, key: string, className: string, ip?: string): void {
    const MESSAGE = addFromIp(`Error: ${error} on method ${key}, on class ${className}`, ip);
    LOGGER_SERVICE.infoLogger(MESSAGE);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function LoggerMethodDecorator(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> | undefined {
    const LOGGING_ENABLED: boolean = GLOBAL_UTIL_ENVIRONMENT_SERVICE.getLoggingEnabled();

    if (!LOGGING_ENABLED) {
        return descriptor;
    }

    const ORIGINAL_METHOD = descriptor.value;
    const CLASS_NAME = target.constructor.name;
    // eslint-disable-next-line consistent-return
    descriptor.value = function (...args: any[]): void {
        const REQUEST = args[0];
        const IP = REQUEST?.ip;

        startMethod(key, CLASS_NAME, IP);

        try {
            const RESULT = ORIGINAL_METHOD.apply(this, args);
            endMethod(key, CLASS_NAME, IP);
            LOGGER_SERVICE.infoLogger(`End method ${key} on class ${CLASS_NAME} from IP ${IP}`);
            return RESULT;
        } catch (error) {
            errorOnMethod(error + '', key, CLASS_NAME, IP);
        }
    };
    return descriptor;
}
