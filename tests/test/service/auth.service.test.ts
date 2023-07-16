import { UserEntity } from '@entity/user.entity';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { UserRepository } from '@repository/user.repository/user.repository';
import { AuthService } from '@service/auth.service/auth.service';
import { IAuthService } from '@service/auth.service/auth.service.interface';
import { PasswordService } from '@service/middleware/password.service/password.service';
import { TokenService } from '@service/middleware/token.service/token.service';
import { UserService } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
import { AuthServiceTestData } from '@testData/service/auth.service.test.data';
import { UserServiceTestData } from '@testData/service/user.service.test.data';
import { anyString, anything, instance, mock, when } from 'ts-mockito';

const USER_SERVICE_TEST_DATA: UserServiceTestData = new UserServiceTestData();
const AUTH_SERVICE_TEST_DATA: AuthServiceTestData = new AuthServiceTestData();

let authService: IAuthService;
let userServiceMock: IUserService;
let userRepositoryMock: UserRepository;
let passwordServiceMock: PasswordService;
let tokenServiceMock: TokenService;

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    generateAuthService();
});

describe('signUp', () => {
    const USER_CREATE: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreate();

    it('Should throw an ArgumentError when application id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_NULL: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsNull();

        // Act & Assert
        await expect(authService.signUp(USER_CREATED_WITH_APPLICATION_ID_NULL)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when application id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_ZERO: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsZero();

        // Act & Assert
        await expect(authService.signUp(USER_CREATED_WITH_APPLICATION_ID_ZERO)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when username is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_USERNAME_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithUsernameIsEmpty();

        // Act & Assert
        await expect(authService.signUp(USER_CREATED_WITH_USERNAME_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUsernameCannotBeEmpty()
        );
    });

    it('Should throw an ArgumentError when password is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_PASSWORD_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithPasswordIsEmpty();

        // Act & Assert
        await expect(authService.signUp(USER_CREATED_WITH_PASSWORD_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidPasswordCannotBeEmpty()
        );
    });

    it('Should return true when user create is successful', async () => {
        // Arrange
        const USER_CREATED: IUserCreated = USER_SERVICE_TEST_DATA.getUserCreated();
        const SUCCESSFULLY_CREATED = USER_SERVICE_TEST_DATA.getSuccessfullyCreated();

        when(userServiceMock.createUser(anything())).thenResolve(USER_CREATED);

        // Act
        const RESULT = await authService.signUp(USER_CREATE);

        // Assert
        expect(RESULT).toBe(SUCCESSFULLY_CREATED);
    });

    it('Should return false when user create is not successful', async () => {
        // Arrange
        const NOT_SUCCESSFULLY_CREATED = USER_SERVICE_TEST_DATA.getNotSuccessfullyCreated();

        when(userServiceMock.createUser(anything())).thenCall(async () => NOT_SUCCESSFULLY_CREATED);

        // Act
        const RESULT = await authService.signUp(USER_CREATE);

        // Assert
        expect(RESULT).toBe(NOT_SUCCESSFULLY_CREATED);
    });
});

describe('signIn', () => {
    const AUTH_SIGN_IN: IAuthSignIn = AUTH_SERVICE_TEST_DATA.getAuthSignIn();
    const USER_ENTITY: UserEntity = USER_SERVICE_TEST_DATA.getUserEntity();
    const NOT_CONTROL_EXISTS_USER: boolean = AUTH_SERVICE_TEST_DATA.getNotControlExists();
    const USER_ID_UNAUTHORIZED_ERROR: UnauthorizedError = AUTH_SERVICE_TEST_DATA.getUnauthorizedErrorNotGetUserEntity(USER_ENTITY.username);

    it('Should throw an ArgumentError when application id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_NULL: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsNull();

        // Act & Assert
        await expect(authService.signIn(USER_CREATED_WITH_APPLICATION_ID_NULL)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when application id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_ZERO: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsZero();

        // Act & Assert
        await expect(authService.signIn(USER_CREATED_WITH_APPLICATION_ID_ZERO)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when username is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_USERNAME_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithUsernameIsEmpty();

        // Act & Assert
        await expect(authService.signIn(USER_CREATED_WITH_USERNAME_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUsernameCannotBeEmpty()
        );
    });

    it('Should throw an ArgumentError when password is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_PASSWORD_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithPasswordIsEmpty();

        // Act & Assert
        await expect(authService.signIn(USER_CREATED_WITH_PASSWORD_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidPasswordCannotBeEmpty()
        );
    });

    it('Should throw an UnauthorizedError when user is not found', async () => {
        // Arrange
        const CONTROL_EXISTS_USER: boolean = AUTH_SERVICE_TEST_DATA.getNotControlExists();

        when(userRepositoryMock.getByName(anyString(), CONTROL_EXISTS_USER)).thenCall(async () => null);

        // Act & Assert
        await expect(authService.signIn(AUTH_SIGN_IN)).rejects.toThrow(USER_ID_UNAUTHORIZED_ERROR);
    });

    it('Should throw an UnauthorizedError when userId is not found', async () => {
        // Arrange
        const CONTROL_EXISTS_USER: boolean = AUTH_SERVICE_TEST_DATA.getNotControlExists();

        when(userRepositoryMock.getByName(anyString(), CONTROL_EXISTS_USER)).thenCall(async () =>
            USER_SERVICE_TEST_DATA.getUserEntityWithUserIdZero()
        );

        // Act & Assert
        await expect(authService.signIn(AUTH_SIGN_IN)).rejects.toThrow(USER_ID_UNAUTHORIZED_ERROR);
    });

    it('Should throw an UnauthorizedError when password is incorrect', async () => {
        // Arrange
        const NOT_VERIFY_PASSWORD: boolean = AUTH_SERVICE_TEST_DATA.getNotVerifyPassword();
        const UNAUTHORIZED_ERROR: UnauthorizedError = AUTH_SERVICE_TEST_DATA.getUnauthorizedErrorNotVerifyPassword();

        when(userRepositoryMock.getByName(anything(), NOT_CONTROL_EXISTS_USER)).thenCall(async () => USER_ENTITY);
        when(passwordServiceMock.verifyPassword(AUTH_SIGN_IN.password, USER_ENTITY.password)).thenCall(async () => NOT_VERIFY_PASSWORD);

        // Act & Assert
        await expect(authService.signIn(AUTH_SIGN_IN)).rejects.toThrow(UNAUTHORIZED_ERROR);
    });

    it('Should return a token when username and password are correct', async () => {
        // Arrange
        const VERIFY_PASSWORD: boolean = AUTH_SERVICE_TEST_DATA.getVerifyPassword();
        const TOKEN = AUTH_SERVICE_TEST_DATA.getToken();

        when(userRepositoryMock.getByName(anything(), NOT_CONTROL_EXISTS_USER)).thenCall(async () => USER_ENTITY);
        when(passwordServiceMock.verifyPassword(AUTH_SIGN_IN.password, USER_ENTITY.password)).thenCall(async () => VERIFY_PASSWORD);
        when(tokenServiceMock.sign(USER_ENTITY.id)).thenCall(async () => TOKEN);

        // Act
        const RESULT = await authService.signIn(AUTH_SIGN_IN);

        // Assert
        expect(RESULT).toBe(TOKEN);
    });
});

function generateAuthService(): void {
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
}
