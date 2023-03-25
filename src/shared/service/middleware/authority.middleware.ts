/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
// archivo: validar-token-middleware.js

import { Request } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';
import { TokenService } from '../token.service';

export async function verifyTokenMiddleware(req: Request): Promise<any | void> {
    const token: string | undefined = req.headers['authorization']?.toString();

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
