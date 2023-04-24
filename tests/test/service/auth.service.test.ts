import { UserEntity } from '@entity/user.entity';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
import { UserRepository } from '@repository/user.repository';
import { AuthService } from '@service/auth.service';
import { PasswordService } from '@service/password.service';
import { TokenService } from '@service/token.service';
import { UserService } from '@service/user.service';
import { AuthServiceTestData } from '@testData/service/auth.service.test.data';
import { UserServiceTestData } from '@testData/service/user.service.test.data';
import { instance, mock, when } from 'ts-mockito';

describe('AuthService', () => {
    const userServiceTestData: UserServiceTestData = new UserServiceTestData();
    const authServiceTestData: AuthServiceTestData = new AuthServiceTestData();

    let authService: AuthService;
    let userServiceMock: UserService;
    let userRepositoryMock: UserRepository;
    let passwordServiceMock: PasswordService;
    let tokenServiceMock: TokenService;

    beforeEach(() => {
        userServiceMock = mock(UserService);
        userRepositoryMock = mock(UserRepository);
        passwordServiceMock = mock(PasswordService);
        tokenServiceMock = mock(TokenService);

        authService = new AuthService(
            instance(userServiceMock),
            instance(userRepositoryMock),
            instance(passwordServiceMock),
            instance(tokenServiceMock)
        );
    });

    describe('signUp', () => {
        it('Should return true when user create is successful', async () => {
            // Arrange
            const USER_CREATE: IUserCreate = userServiceTestData.getUserCreate();

            when(userServiceMock.createUser(USER_CREATE)).thenCall(async () => true);

            // Act
            const RESULT = await authService.signUp(USER_CREATE);

            // Assert
            expect(RESULT).toBe(true);
        });
    });

    describe('signIn', () => {
        it('Should throw an UnauthorizedError when user is not found', async () => {
            // Arrange
            const AUTH_SIGN_IN: IAuthSignIn = authServiceTestData.getAuthSignIn();
            const UNAUTHORIZED_ERROR: UnauthorizedError = authServiceTestData.getUnauthorizedError();

            when(userRepositoryMock.getByName(AUTH_SIGN_IN.username, false)).thenCall(async () => null);

            // Act & Assert
            await expect(authService.signIn(AUTH_SIGN_IN)).rejects.toThrow(UNAUTHORIZED_ERROR);
        });

        it('Should throw an UnauthorizedError when password is incorrect', async () => {
            // Arrange
            const AUTH_SIGN_IN: IAuthSignIn = authServiceTestData.getAuthSignIn();
            const USER_ENTITY: UserEntity = userServiceTestData.getUserEntity();
            const UNAUTHORIZED_ERROR: UnauthorizedError = authServiceTestData.getUnauthorizedError();

            when(userRepositoryMock.getByName(AUTH_SIGN_IN.username, false)).thenCall(async () => USER_ENTITY);
            when(passwordServiceMock.verifyPassword(AUTH_SIGN_IN.password, USER_ENTITY.password)).thenCall(async () => false);

            // Act & Assert
            await expect(authService.signIn(AUTH_SIGN_IN)).rejects.toThrow(UNAUTHORIZED_ERROR);
        });

        it('Should return a token when username and password are correct', async () => {
            // Arrange
            const AUTH_SIGN_IN: IAuthSignIn = authServiceTestData.getAuthSignIn();
            const USER_ENTITY: UserEntity = userServiceTestData.getUserEntity();
            const TOKEN = authServiceTestData.getToken();

            when(userRepositoryMock.getByName(AUTH_SIGN_IN.username, false)).thenCall(async () => USER_ENTITY);
            when(passwordServiceMock.verifyPassword(AUTH_SIGN_IN.password, USER_ENTITY.password)).thenCall(async () => true);
            when(tokenServiceMock.sign(USER_ENTITY.id)).thenCall(async () => TOKEN);

            // Act
            const RESULT = await authService.signIn(AUTH_SIGN_IN);

            // Assert
            expect(RESULT).toBe(TOKEN);
        });
    });
});
