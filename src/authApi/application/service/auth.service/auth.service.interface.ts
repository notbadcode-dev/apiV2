import { TAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
import 'reflect-metadata';

export interface IAuthService {
    signUp(userCreate: IUserCreate): Promise<boolean>;

    signIn(authSignIn: TAuthSignIn): Promise<string>;
}
