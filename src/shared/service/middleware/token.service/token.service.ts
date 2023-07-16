import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { IUser } from '@model/user/user.model';
import { GLOBAL_UTIL_ENV_SERVICE_TOKEN } from '@service/global/global.util.env.service/global.util.env.service';
import { IGlobalUtilEnvService } from '@service/global/global.util.env.service/global.util.env.service.interface';
import { ITokenService } from '@service/middleware/token.service/token.service.interface';
import { USER_SERVICE_TOKEN } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { Inject, Service, Token } from 'typedi';

export const TOKEN_SERVICE_TOKEN = new Token<ITokenService>('TokenService');

@Service(TOKEN_SERVICE_TOKEN)
export class TokenService implements ITokenService {
    private currentUser: IUser | null = null;

    constructor(
        @Inject(USER_SERVICE_TOKEN) private _userService: IUserService,
        @Inject(GLOBAL_UTIL_ENV_SERVICE_TOKEN) private _globalUtilEnvService: IGlobalUtilEnvService
    ) {}

    @LoggerMethodDecorator
    public sign(userId: number): string {
        const SESSION_SECRET = this._globalUtilEnvService.getSessionSecret();
        const TOKEN = jwt.sign({ userId }, SESSION_SECRET, { expiresIn: this._globalUtilEnvService.getSessionExpiresIn() });
        return TOKEN;
    }

    @LoggerMethodDecorator
    public decode(token: string): { userId: number } | null {
        try {
            const DECODED = jwt.decode(token) as { userId: number };
            return DECODED;
        } catch {
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
        } catch {
            throw new UnauthorizedError();
        }
    }
}
