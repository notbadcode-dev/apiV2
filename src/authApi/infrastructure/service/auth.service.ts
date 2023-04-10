import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
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
        const USER_CREATED = await this._userService.createUser(userCreate);
        return !!USER_CREATED;
    }

    @LoggerMethodDecorator
    public async signIn(authSignIn: IAuthSignIn): Promise<string> {
        const USER_ENTITY = await this._userRepository.getByName(authSignIn.username, false);

        if (!USER_ENTITY || !USER_ENTITY?.id) {
            throw new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
        }

        const DECRYPTED_PASSWORD = await this._passwordService.verifyPassword(authSignIn.password, USER_ENTITY?.password);

        if (!DECRYPTED_PASSWORD) {
            throw new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
        }

        const TOKEN = this._tokenService.sign(USER_ENTITY?.id);

        return TOKEN;
    }
}
