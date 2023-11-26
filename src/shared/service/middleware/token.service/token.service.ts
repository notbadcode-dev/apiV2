import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { InternalServerError } from '@error/internal-server.error';
import { IUser } from '@model/user/user.model';
import { GLOBAL_UTIL_ENV_SERVICE_TOKEN } from '@service/global/global.util.env.service/global.util.env.service';
import { IGlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service.interface';
import { ITokenService } from '@service/middleware/token.service/token.service.interface';
import { USER_SERVICE_TOKEN } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { Inject, Service, Token } from 'typedi';

export const TOKEN_SERVICE_TOKEN = new Token<ITokenService>('TokenService');

@Service(TOKEN_SERVICE_TOKEN)
export class TokenService implements ITokenService {
    private currentUser: IUser | null = null;

    private activeTokens: { [userId: number]: string } = {};

    constructor(
        @Inject(USER_SERVICE_TOKEN) private _userService: IUserService,
        @Inject(GLOBAL_UTIL_ENV_SERVICE_TOKEN) private _globalUtilEnvService: IGlobalUtilEnvService
    ) {}

    @LoggerMethodDecorator
    public sign(userId: number): string {
        const SESSION_SECRET = this._globalUtilEnvService.getSessionSecret();
        const TOKEN = jwt.sign({ userId: userId }, SESSION_SECRET, {
            expiresIn: this._globalUtilEnvService.getSessionExpiresIn(),
            algorithm: this._globalUtilEnvService.getHashedAlgorithm(),
        });

        if (this.activeTokens[userId]) {
            this.expireToken(this.activeTokens[userId]);
        }

        this.activeTokens[userId] = TOKEN;

        return TOKEN;
    }

    @LoggerMethodDecorator
    public decode(token: string): { userId: number } | null {
        try {
            const DECODED = jwt.decode(token) as { userId: number };
            return DECODED;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
                throw new InternalServerError();
            }
            return null;
        }
    }

    @LoggerMethodDecorator
    public refresh(token: string): string | null {
        const DECODED = this.decode(token);
        if (!DECODED) {
            return null;
        }
        const NEW_TOKEN = this.sign(DECODED.userId);
        this.activeTokens[this.getCurrentUserId()] = NEW_TOKEN;
        return NEW_TOKEN;
    }

    @LoggerMethodDecorator
    public async setCurrentUser(userId: number): Promise<void> {
        this.currentUser = await this._userService.getUser(userId);
    }

    @LoggerMethodDecorator
    public getCurrentUser(): IUser | null {
        return this.currentUser;
    }

    @LoggerMethodDecorator
    public getCurrentUserId(): number {
        return this.currentUser?.id ?? 0;
    }

    @LoggerMethodDecorator
    public verify(token: string): number | null {
        try {
            const DECODED = jwt.verify(token, this._globalUtilEnvService.getSessionSecret()) as { userId: number };
            return DECODED.userId;
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedError();
            }
            return null;
        }
    }

    public expireToken(token: string): void {
        if (!token?.length) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        for (const userId in this.activeTokens) {
            if (this.activeTokens[userId] === token) {
                delete this.activeTokens[userId];
                break;
            }
        }
    }
}
