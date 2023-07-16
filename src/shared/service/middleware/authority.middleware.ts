/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
// archivo: validar-token-middleware.js

import { Request } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';
import { TokenService } from './token.service/token.service';

export async function verifyTokenMiddleware(req: Request): Promise<void> {
    const HEADER_AUTHORIZATION: string | null = req?.headers?.authorization ?? null;

    if (!HEADER_AUTHORIZATION) {
        throw new UnauthorizedError();
    }

    const TOKEN: string | null = HEADER_AUTHORIZATION?.toString() ?? null;

    if (!TOKEN) {
        throw new UnauthorizedError();
    }

    const USER_ID = TokenService.verify(TOKEN);

    if (!USER_ID) {
        throw new UnauthorizedError();
    }

    const TOKEN_SERVICE: TokenService = Container.get(TokenService);

    await TOKEN_SERVICE.setCurrentUser(USER_ID);
}
