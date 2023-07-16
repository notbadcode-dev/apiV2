/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
// archivo: validar-token-middleware.js

import { Request } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';
import { TokenService, TOKEN_SERVICE_TOKEN } from './token.service/token.service';
import { ITokenService } from './token.service/token.service.interface';

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

    const TOKEN_SERVICE: ITokenService = Container.get(TOKEN_SERVICE_TOKEN);

    await TOKEN_SERVICE.setCurrentUser(USER_ID);
}
