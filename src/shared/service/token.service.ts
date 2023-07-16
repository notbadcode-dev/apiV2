import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { IUserService } from '@interface/user.service.interface';
import { IUser } from '@model/user/user.model';
import { GlobalUtilEnvService } from '@service/global/global.util.env.service';
import { USER_SERVICE_TOKEN } from '@service/user.service';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
export class TokenService {
    private static sessionSecret = GlobalUtilEnvService.getSessionSecret();

    private sessionExpiresIn = GlobalUtilEnvService.getSessionExpiresIn();

    private currentUser: IUser | null = null;

    constructor(@Inject(USER_SERVICE_TOKEN) private _userService: IUserService) {}

    @LoggerMethodDecorator
    public sign(userId: number): string {
        const SESSION_SECRET = GlobalUtilEnvService.getSessionSecret();
        const TOKEN = jwt.sign({ userId }, SESSION_SECRET, { expiresIn: this.sessionExpiresIn });
        return TOKEN;
    }

    @LoggerMethodDecorator
    public static verify(token: string): number | null {
        try {
            const DECODED = jwt.verify(token, this.sessionSecret) as { userId: number };
            return DECODED.userId;
        } catch {
            throw new UnauthorizedError();
        }
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

    public async setCurrentUser(userId: number): Promise<void> {
        this.currentUser = await this._userService.getUser(userId);
    }

    public getCurrentUser(): IUser | null {
        return this.currentUser;
    }

    public getCurrentUserId(): number {
        return this.currentUser?.id ?? 0;
    }
}
