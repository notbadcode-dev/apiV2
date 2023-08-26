import { TAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
import { AUTH_SERVICE_TOKEN } from '@service/auth.service/auth.service';
import { IAuthService } from '@service/auth.service/auth.service.interface';
import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/authentication')
export class UserController {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private _authService: IAuthService) {}

    @Post('/sign-up')
    async signUp(@Body() userCreate: IUserCreate): Promise<boolean> {
        return this._authService.signUp(userCreate);
    }

    @Post('/sign-in')
    async signIn(@Body() authSignIn: TAuthSignIn): Promise<string> {
        return this._authService.signIn(authSignIn);
    }
}
