/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { ITokenService } from '@service/middleware/token.service/token.service.interface';

import { Request } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';

export async function verifyTokenMiddleware(req: Request): Promise<void> {
    const HEADER_AUTHORIZATION: string | null = req?.headers?.authorization ?? null;

    if (!HEADER_AUTHORIZATION) {
        throw new UnauthorizedError();
    }

    const TOKEN: string | null = HEADER_AUTHORIZATION?.toString() ?? null;

    if (!TOKEN) {
        throw new UnauthorizedError();
    }

    const TOKEN_SERVICE: ITokenService = Container.get(TOKEN_SERVICE_TOKEN);
    const USER_ID = TOKEN_SERVICE.verify(TOKEN);

    if (!USER_ID) {
        throw new UnauthorizedError();
    }

    await TOKEN_SERVICE.setCurrentUser(USER_ID);
}
