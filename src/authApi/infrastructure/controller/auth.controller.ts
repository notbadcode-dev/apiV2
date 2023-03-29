import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthService } from '../service/auth.service';

@Service()
@JsonController('/authentication')
export class UserController {
    constructor(@Inject() private _authService: AuthService) {}

    @Post('/sign-up')
    async signUp(@Body() userCreate: IUserCreate): Promise<boolean> {
        return this._authService.signUp(userCreate);
    }

    @Post('/sign-in')
    async signIn(@Body() authSignIn: IAuthSignIn): Promise<string> {
        return this._authService.signIn(authSignIn);
    }
}
