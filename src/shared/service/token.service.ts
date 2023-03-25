import { IUser } from 'authApi/domain/model/user/user.model';
import { UserService } from 'authApi/infrastructure/service/user.service';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { LoggerMethodDecorator } from './decorator/logger-method.decorator';
import { GlobalUtilEnvService } from './global/global.util.env.service';

@Service()
export class TokenService {
    private static sessionSecret = GlobalUtilEnvService.getSessionSecret();
    private sessionExpiresIn = GlobalUtilEnvService.getSessionExpiresIn();
    private currentUser: IUser | null = null;

    constructor(@Inject() private _userService: UserService) {}

    @LoggerMethodDecorator
    public sign(userId: number): string {
        const sessionSecret = GlobalUtilEnvService.getSessionSecret();
        const token = jwt.sign({ userId }, sessionSecret, { expiresIn: this.sessionExpiresIn });
        return token;
    }

    @LoggerMethodDecorator
    public static verify(token: string): number | null {
        try {
            const decoded = jwt.verify(token, this.sessionSecret) as { userId: number };
            return decoded.userId;
        } catch {
            throw new UnauthorizedError();
        }
    }

    @LoggerMethodDecorator
    public decode(token: string): { userId: number } | null {
        try {
            const decoded = jwt.decode(token) as { userId: number };
            return decoded;
        } catch {
            return null;
        }
    }

    @LoggerMethodDecorator
    public refresh(token: string): string | null {
        const decoded = this.decode(token);
        if (!decoded) {
            return null;
        }
        const newToken = this.sign(decoded.userId);
        return newToken;
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
