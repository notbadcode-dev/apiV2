/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
// archivo: validar-token-middleware.js

import { Request } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';
import { TokenService } from '../token.service';

export async function verifyTokenMiddleware(req: Request): Promise<void> {
    const headersAuthorization: string | null = req?.headers?.authorization ?? null;

    if (!headersAuthorization) {
        throw new UnauthorizedError();
    }

    const token: string | null = headersAuthorization?.toString() ?? null;

    if (!token) {
        throw new UnauthorizedError();
    }

    const userId = TokenService.verify(token);

    if (!userId) {
        throw new UnauthorizedError();
    }

    const tokenService: TokenService = Container.get(TokenService);

    await tokenService.setCurrentUser(userId);
}
