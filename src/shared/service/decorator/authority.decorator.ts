/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { verifyTokenMiddleware } from '../middleware/authority.middleware';

export function Authority(target: any, propertyKey: string, descriptor: PropertyDescriptor): any | PropertyDescriptor {
    const middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await verifyTokenMiddleware(req);
    };
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]): Promise<void> {
        const [req, res] = args;
        return middleware(req, res, () => originalMethod.apply(this, args));
    };
    return descriptor;
}
