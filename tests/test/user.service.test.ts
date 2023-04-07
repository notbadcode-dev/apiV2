import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { NotFountError } from '@error/not-found.error';
import { UserEntityToUserMapper } from '@mapper/user/userEntityToUser.mapper';
import { UserEntityToUserCreatedMapper } from '@mapper/user/userEntityToUserCreated.mapper';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { ApplicationRepository } from '@repository/application.repository';
import { UserApplicationRepository } from '@repository/user-application.repository';
import { UserRepository } from '@repository/user.repository';
import { UserService } from '@service/user.service';
import { UserServiceTestData } from '@testData/user.service.test.data';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

describe('UserService', () => {
    const userServiceTestData: UserServiceTestData = new UserServiceTestData();

    let userService: UserService;
    let userRepositoryMock: UserRepository;
    let applicationRepositoryMock: ApplicationRepository;
    let userApplicationRepositoryMock: UserApplicationRepository;
    let userEntityToUserMapperMock: UserEntityToUserMapper;
    let userEntityToUserCreatedMapperMock: UserEntityToUserCreatedMapper;

    beforeEach(() => {
        userRepositoryMock = mock(UserRepository);
        applicationRepositoryMock = mock(ApplicationRepository);
        userApplicationRepositoryMock = mock(UserApplicationRepository);
        userEntityToUserMapperMock = mock(UserEntityToUserMapper);
        userEntityToUserCreatedMapperMock = mock(UserEntityToUserCreatedMapper);
        userService = new UserService(
            instance(userRepositoryMock),
            instance(applicationRepositoryMock),
            instance(userApplicationRepositoryMock),
            instance(userEntityToUserMapperMock),
            instance(userEntityToUserCreatedMapperMock)
        );
    });

    describe('createUser', () => {
        it('UsernameAlreadyExists_ShouldAlreadyExistsError', async () => {
            // Arrange
            const userCreate: IUserCreate = userServiceTestData.getUserCreate();
            const userEntity: UserEntity = userServiceTestData.getUserEntity();

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(1);
            });

            when(userRepositoryMock.getByName(anyString(), false)).thenCall(async () => {
                return Promise.resolve(userEntity);
            });

            // Act & Assert
            await expect(userService.createUser(userCreate)).rejects.toThrowError(AlreadyExistsError);
        });

        it('ApplicationDoesNotExist_ShouldNotFoundError', async () => {
            // Arrange
            const userCreate: IUserCreate = userServiceTestData.getUserCreate();

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.createUser(userCreate)).rejects.toThrowError(NotFountError);
        });

        it('UserCreateOk_ShouldReturnUserEntity', async () => {
            // Arrange
            const userCreate: IUserCreate = userServiceTestData.getUserCreate();
            const userCreatedEntity: IUserCreated = userServiceTestData.getUserCreated();
            const userCreatedExpected: IUserCreated = userServiceTestData.getUserCreatedExpired();
            const applicationId: number = userServiceTestData.getApplicationId();

            const userId = userServiceTestData.getUser().id;

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(applicationId);
            });

            when(userRepositoryMock.create(anyString(), anyString())).thenCall(async () => {
                return Promise.resolve(userId);
            });

            when(userApplicationRepositoryMock.create(anything(), anything())).thenCall(async () => {
                return Promise.resolve(userCreatedEntity);
            });

            when(userEntityToUserCreatedMapperMock.mapWithApplicationId(anything(), anyNumber())).thenReturn(userCreatedExpected);

            // Act
            const result: IUserCreated = await userService.createUser(userCreate);

            // Assert
            expect(result).toEqual(userCreatedExpected);
        });
    });

    describe('updateUser', () => {
        it('UserDoesNotExist_ShouldNotFoundError', async () => {
            // Arrange
            const userUpdate: IUserUpdater = userServiceTestData.getUserUpdated();

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.updateUser(userUpdate.id, userUpdate)).rejects.toThrow(NotFountError);
        });

        it('UserExists_ShouldReturnUpdatedUser', async () => {
            // Arrange
            const userUpdate: IUserUpdater = userServiceTestData.getUserUpdated();
            const existingUser: IUser = userServiceTestData.getUserEntity();

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(existingUser);
            });

            when(userRepositoryMock.update(userUpdate)).thenCall(async () => {
                return Promise.resolve(userUpdate);
            });

            // Act
            const result: IUser = await userService.updateUser(userUpdate.id, userUpdate);

            // Assert
            expect(result).toEqual(userUpdate);
        });
    });

    describe('getUser', () => {
        it('UserDoesNotExist_ShouldNotFoundError', async () => {
            // Arrange
            const userId: number = userServiceTestData.getUserEntity()?.id;

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.getUser(userId)).rejects.toThrow(NotFountError);
        });

        it('UserExists_ShouldReturnUser', async () => {
            // Arrange
            const userEntity: UserEntity = userServiceTestData.getUserEntity();
            const user: IUser = userServiceTestData.getUserEntity();
            const userId: number = userEntity.id;

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(userEntity);
            });

            when(userEntityToUserMapperMock.map(userEntity)).thenCall(async () => {
                return Promise.resolve(user);
            });

            // Act
            const result: IUser = await userService.getUser(userId);

            // Assert
            expect(result).toEqual(user);
        });
    });

    describe('getAllUsers', () => {
        it('Ok_ShouldReturnListOfUsers', async () => {
            // Arrange
            const userEntityList: UserEntity[] = userServiceTestData.getUserEntityList();
            const expectedUserList: IUser[] = userServiceTestData.getUserList();

            when(userRepositoryMock.getAll()).thenCall(async () => {
                return userEntityList;
            });

            when(userEntityToUserMapperMock.mapList(userEntityList)).thenCall(() => {
                return expectedUserList;
            });

            // Act
            const userList: IUser[] = await userService.getAllUsers();

            // Assert
            expect(userList).toEqual(expectedUserList);
        });

        it('Ok_ShouldReturnEmptyListOfUsers', async () => {
            // Arrange
            when(userRepositoryMock.getAll()).thenCall(async () => []);

            when(userEntityToUserMapperMock.mapList(anything())).thenCall(() => {
                return new Array<IUser>();
            });

            // Act
            const userList: IUser[] = await userService.getAllUsers();

            // Assert
            expect(userList).toEqual(new Array<IUser>());
        });
    });
});
