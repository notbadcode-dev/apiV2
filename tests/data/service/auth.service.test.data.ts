import { ERROR_MESSAGE_PASSWORD } from '@constant/error-message/error-message-password.constant';
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

    getUnauthorizedError(): UnauthorizedError {
        return new UnauthorizedError(ERROR_MESSAGE_PASSWORD.FAILED_TO_VERIFY_PASSWORD);
    }
}
