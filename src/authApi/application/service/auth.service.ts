import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { ArgumentError } from '@error/argument.error';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthService } from '@interface/auth.service.interface';
import { IUserService } from '@interface/user.service.interface';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { UserRepository } from '@repository/user.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { PasswordService } from '@service/password.service';
import { TokenService } from '@service/token.service';
import { Inject, Service, Token } from 'typedi';
import { USER_SERVICE_TOKEN } from './user.service';

export const AUTH_SERVICE_TOKEN = new Token<IAuthService>('AuthService');

@Service(AUTH_SERVICE_TOKEN)
export class AuthService implements IAuthService {
    constructor(
        @Inject(USER_SERVICE_TOKEN) private _userService: IUserService,
        @Inject() private _userRepository: UserRepository,
        @Inject() private _passwordService: PasswordService,
        @Inject() private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    public async signUp(userCreate: IUserCreate): Promise<boolean> {
        this.validateArgumentsOnSignUp(userCreate);

        const USER_CREATED: IUserCreated = await this._userService.createUser(userCreate);
        const SUCCESSFULLY_CREATED = !!USER_CREATED;
        return SUCCESSFULLY_CREATED;
    }

    @LoggerMethodDecorator
    public async signIn(authSignIn: IAuthSignIn): Promise<string> {
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
    private validateArgumentsOnSignUp(createUser: IUserCreate): void {
        this.validateApplicationId(createUser?.applicationId ?? null);
        this.validateUsername(createUser?.username ?? '');
        this.validatePassword(createUser?.password ?? '');
    }

    @LoggerMethodDecorator
    private validateArgumentsOnSignIn(authSignIn: IAuthSignIn): void {
        this.validateApplicationId(authSignIn?.applicationId ?? null);
        this.validateUsername(authSignIn?.username ?? '');
        this.validatePassword(authSignIn?.password ?? '');
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
}
