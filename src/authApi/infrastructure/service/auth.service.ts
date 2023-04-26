import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { UserRepository } from '@repository/user.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { PasswordService } from '@service/password.service';
import { TokenService } from '@service/token.service';
import { Inject, Service } from 'typedi';
import { UserService } from './user.service';

@Service()
export class AuthService {
    constructor(
        @Inject() private _userService: UserService,
        @Inject() private _userRepository: UserRepository,
        @Inject() private _passwordService: PasswordService,
        @Inject() private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    public async signUp(userCreate: IUserCreate): Promise<boolean> {
        const USER_CREATED: IUserCreated = await this._userService.createUser(userCreate);
        const SUCCESSFULLY_CREATED = !!USER_CREATED;
        return SUCCESSFULLY_CREATED;
    }

    @LoggerMethodDecorator
    public async signIn(authSignIn: IAuthSignIn): Promise<string> {
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
}
