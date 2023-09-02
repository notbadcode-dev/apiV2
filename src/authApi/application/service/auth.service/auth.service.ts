import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { ERROR_MESSAGE_TOKEN } from '@constant/error-message/error-message-token.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { ArgumentError } from '@error/argument.error';
import { UnauthorizedError } from '@error/unauthorized.error';
import { TAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IGetUserByToken } from '@model/user/get-user-by-token.model';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUser } from '@model/user/user.model';
import { UserRepository, USER_REPOSITORY_TOKEN } from '@repository/user.repository/user.repository';
import { IAuthService } from '@service/auth.service/auth.service.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { PasswordService, PASSWORD_SERVICE_TOKEN } from '@service/middleware/password.service/password.service';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { USER_SERVICE_TOKEN } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
import { Inject, Service, Token } from 'typedi';

export const AUTH_SERVICE_TOKEN = new Token<IAuthService>('AuthService');

@Service(AUTH_SERVICE_TOKEN)
export class AuthService implements IAuthService {
    constructor(
        @Inject(USER_SERVICE_TOKEN) private _userService: IUserService,
        @Inject(USER_REPOSITORY_TOKEN) private _userRepository: UserRepository,
        @Inject(PASSWORD_SERVICE_TOKEN) private _passwordService: PasswordService,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    public async signUp(userCreate: IUserCreate): Promise<boolean> {
        this.validateArgumentsOnSignUp(userCreate);

        const USER_CREATED: IUserCreated = await this._userService.createUser(userCreate);
        const SUCCESSFULLY_CREATED = !!USER_CREATED;
        return SUCCESSFULLY_CREATED;
    }

    @LoggerMethodDecorator
    public async signIn(authSignIn: TAuthSignIn): Promise<string> {
        this.validateArgumentsOnSignIn(authSignIn);

        const USER_ENTITY: UserEntity | null = await this._userRepository.getByName(authSignIn.username, false);

        if (!USER_ENTITY || !USER_ENTITY?.id) {
            throw new UnauthorizedError(ERROR_MESSAGE_USER.USER_WITH_USERNAME_NOT_FOUND(authSignIn.username));
        }

        const DECRYPTED_PASSWORD: boolean = await this._passwordService.verifyPassword(authSignIn.password, USER_ENTITY?.password);

        if (!DECRYPTED_PASSWORD) {
            throw new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
        }

        const TOKEN = this._tokenService.sign(USER_ENTITY?.id);

        return TOKEN;
    }

    @LoggerMethodDecorator
    public async getUserByToken(getUserByToken: IGetUserByToken): Promise<IUser> {
        this.validateArgumentsGetUserByToken(getUserByToken);

        const USER_ID: number = this._tokenService.decode(getUserByToken.token)?.userId ?? 0;

        if (!USER_ID) {
            throw new UnauthorizedError(ERROR_MESSAGE_TOKEN.FAILED_TO_VERIFY_TOKEN);
        }

        const USER: IUser = await this._userService.getUser(USER_ID);

        if (!USER) {
            throw new UnauthorizedError(ERROR_MESSAGE_TOKEN.FAILED_TO_VERIFY_TOKEN);
        }

        return USER;
    }

    @LoggerMethodDecorator
    private validateArgumentsOnSignUp(createUser: IUserCreate): void {
        this.validateApplicationId(createUser?.applicationId ?? null);
        this.validateUsername(createUser?.username ?? '');
        this.validatePassword(createUser?.password ?? '');
    }

    @LoggerMethodDecorator
    private validateArgumentsOnSignIn(authSignIn: TAuthSignIn): void {
        this.validateApplicationId(authSignIn?.applicationId ?? null);
        this.validateUsername(authSignIn?.username ?? '');
        this.validatePassword(authSignIn?.password ?? '');
    }

    private validateArgumentsGetUserByToken(getUserByToken: IGetUserByToken): void {
        this.validateApplicationId(getUserByToken?.applicationId ?? null);
        this.validateToken(getUserByToken?.token ?? '');
    }

    @LoggerMethodDecorator
    private validateApplicationId(applicationId?: number | null): void {
        if (!applicationId || isNaN(Number(applicationId)) || applicationId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_USER.INVALID_APPLICATION_ID);
        }
    }

    @LoggerMethodDecorator
    private validateUsername(username: string): void {
        if (!username?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_USER.USERNAME_CANNOT_BE_EMPTY);
        }
    }

    @LoggerMethodDecorator
    private validatePassword(password: string): void {
        if (!password?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_USER.PASSWORD_CANNOT_BE_EMPTY);
        }
    }

    @LoggerMethodDecorator
    private validateToken(token: string): void {
        if (!token?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_USER.TOKEN_CANNOT_BE_EMPTY);
        }
    }
}
