import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { UserServiceTestData } from './user.service.test.data';

const userServiceTestData: UserServiceTestData = new UserServiceTestData();

export class AuthServiceTestData {
    getAuthSignIn(): IAuthSignIn {
        return userServiceTestData.getUserCreate();
    }

    getToken(): string {
        return 'testToken';
    }
}
