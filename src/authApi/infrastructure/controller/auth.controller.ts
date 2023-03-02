import { JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { AuthService } from '../service/auth.service';

@Service()
@JsonController('/authentication')
export class UserController {
    constructor(@Inject() private _authService: AuthService) {}

    @Post('/sign-up')
    async getAllUsers(): Promise<boolean> {
        return this._authService.signUp();
    }

    @Post('/sign-in')
    async getUser(): Promise<boolean> {
        return this._authService.signUp();
    }
}
