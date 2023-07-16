import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UnauthorizedError } from '@error/unauthorized.error';
import { TAuthSignIn } from '@model/auth/auth-sign-in.model';
import { UserServiceTestData } from './user.service.test.data';

const USER_SERVICE_TEST_DATA: UserServiceTestData = new UserServiceTestData();

export class AuthServiceTestData {
    getAuthSignIn(): TAuthSignIn {
        return USER_SERVICE_TEST_DATA.getUserCreate();
    }

    public getToken(): string {
        return 'testToken';
    }

    public getControlExists(): boolean {
        return true;
    }

    public getNotControlExists(): boolean {
        return false;
    }

    public getVerifyPassword(): boolean {
        return true;
    }

    public getNotVerifyPassword(): boolean {
        return false;
    }

    public getUnauthorizedErrorNotGetUserEntity(userName: string): UnauthorizedError {
        return new UnauthorizedError(ERROR_MESSAGE_USER.USER_WITH_USERNAME_NOT_FOUND(userName));
    }

    public getUnauthorizedErrorNotVerifyPassword(): UnauthorizedError {
        return new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
    }
}
