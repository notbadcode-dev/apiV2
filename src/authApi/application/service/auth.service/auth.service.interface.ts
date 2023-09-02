import { TAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IGetUserByToken } from '@model/user/get-user-by-token.model';
import { IUserCreate } from '@model/user/user-create.model';
import { IUser } from '@model/user/user.model';
import 'reflect-metadata';

export interface IAuthService {
    signUp(userCreate: IUserCreate): Promise<boolean>;

    signIn(authSignIn: TAuthSignIn): Promise<string>;

    getUserByToken(getUserByToken: IGetUserByToken): Promise<IUser>;
}
