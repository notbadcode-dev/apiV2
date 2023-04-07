import { UserEntity } from '@entity/user.entity';
import { UnauthorizedError } from '@error/unauthorized.error';
import { IAuthSignIn } from '@model/auth/auth-sign-in.model';
import { IUserCreate } from '@model/user/user-create.model';
import { UserRepository } from '@repository/user.repository';
import { AuthService } from '@service/auth.service';
import { PasswordService } from '@service/password.service';
import { TokenService } from '@service/token.service';
import { UserService } from '@service/user.service';
import { AuthServiceTestData } from '@testData/auth.service.test.data';
import { UserServiceTestData } from '@testData/user.service.test.data';
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
        it('should call createUser from userService and return true if the user is created', async () => {
            // Arrange
            const userCreate: IUserCreate = userServiceTestData.getUserCreate();
            when(userServiceMock.createUser(userCreate)).thenCall(async () => true);

            // Act
            const result = await authService.signUp(userCreate);

            // Assert
            expect(result).toBe(true);
        });
    });

    describe('signIn', () => {
        it('should throw an error if the user is not found', async () => {
            // Arrange
            const authSignIn: IAuthSignIn = authServiceTestData.getAuthSignIn();

            when(userRepositoryMock.getByName(authSignIn.username, false)).thenCall(async () => null);

            // Act & Assert
            await expect(authService.signIn(authSignIn)).rejects.toThrow(UnauthorizedError);
        });

        it('should throw an error if the password is incorrect', async () => {
            // Arrange
            const authSignIn: IAuthSignIn = authServiceTestData.getAuthSignIn();
            const userEntity: UserEntity = userServiceTestData.getUserEntity();

            when(userRepositoryMock.getByName(authSignIn.username, false)).thenCall(async () => userEntity);
            when(passwordServiceMock.verifyPassword(authSignIn.password, userEntity.password)).thenCall(async () => false);

            // Act & Assert
            await expect(authService.signIn(authSignIn)).rejects.toThrow(UnauthorizedError);
        });

        it('should sign the user and return a token if the username and password are correct', async () => {
            // Arrange
            const authSignIn: IAuthSignIn = authServiceTestData.getAuthSignIn();
            const userEntity: UserEntity = userServiceTestData.getUserEntity();
            const token = authServiceTestData.getToken();

            when(userRepositoryMock.getByName(authSignIn.username, false)).thenCall(async () => userEntity);
            when(passwordServiceMock.verifyPassword(authSignIn.password, userEntity.password)).thenCall(async () => true);
            when(tokenServiceMock.sign(userEntity.id)).thenCall(async () => token);

            // Act
            const result = await authService.signIn(authSignIn);

            // Assert
            expect(result).toBe(token);
        });
    });
});
