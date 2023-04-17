/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyTokenMiddleware } from '@service/middleware/authority.middleware';
import { NextFunction } from 'express';
import { UnauthorizedError } from 'routing-controllers';

export function Authority(target: any, propertyKey: string, descriptor: PropertyDescriptor): any | PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<NextFunction> {
        const [req] = args;

        try {
            await verifyTokenMiddleware(req);
        } catch {
            throw new UnauthorizedError();
        }

        return await originalMethod.apply(this, args);
    };
    return descriptor;
}
