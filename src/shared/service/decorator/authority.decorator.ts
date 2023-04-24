/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyTokenMiddleware } from '@service/middleware/authority.middleware';
import { NextFunction } from 'express';
import { UnauthorizedError } from 'routing-controllers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Authority(target: any, propertyKey: string, descriptor: PropertyDescriptor): any | PropertyDescriptor {
    const ORIGINAL_METHOD = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<NextFunction> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const [req] = args;

        try {
            await verifyTokenMiddleware(req);
        } catch {
            throw new UnauthorizedError();
        }

        return ORIGINAL_METHOD.apply(this, args);
    };
    return descriptor;
}
