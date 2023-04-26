import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UnauthorizedError } from '@error/unauthorized.error';
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

    getControlExists(): boolean {
        return true;
    }

    getNotControlExists(): boolean {
        return false;
    }

    getVerifyPassword(): boolean {
        return true;
    }

    getNotVerifyPassword(): boolean {
        return false;
    }

    getUnauthorizedErrorNotGetUserEntity(userName: string): UnauthorizedError {
        return new UnauthorizedError(ERROR_MESSAGE_USER.USER_WITH_USERNAME_NOT_FOUND(userName));
    }

    getUnauthorizedErrorNotVerifyPassword(): UnauthorizedError {
        return new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
    }
}
