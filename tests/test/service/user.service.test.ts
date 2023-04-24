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
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { UserService } from '@service/user.service';
import { UserServiceTestData } from '@testData/service/user.service.test.data';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

describe('UserService', () => {
    const USER_SERVICE_TEST_DATA: UserServiceTestData = new UserServiceTestData();

    let userService: UserService;
    let userRepositoryMock: UserRepository;
    let applicationRepositoryMock: ApplicationRepository;
    let userApplicationRepositoryMock: UserApplicationRepository;
    let userEntityToUserMapperMock: UserEntityToUserMapper;
    let userEntityToUserCreatedMapperMock: UserEntityToUserCreatedMapper;
    let globalUtilValidateServiceMock: GlobalUtilValidateService;

    beforeEach(() => {
        userRepositoryMock = mock(UserRepository);
        applicationRepositoryMock = mock(ApplicationRepository);
        userApplicationRepositoryMock = mock(UserApplicationRepository);
        userEntityToUserMapperMock = mock(UserEntityToUserMapper);
        userEntityToUserCreatedMapperMock = mock(UserEntityToUserCreatedMapper);
        globalUtilValidateServiceMock = mock(GlobalUtilValidateService);

        userService = new UserService(
            instance(userRepositoryMock),
            instance(applicationRepositoryMock),
            instance(userApplicationRepositoryMock),
            instance(userEntityToUserMapperMock),
            instance(userEntityToUserCreatedMapperMock),
            instance(globalUtilValidateServiceMock)
        );
    });

    describe('createUser', () => {
        it('Should throw AlreadyExistsError when username already exists', async () => {
            // Arrange
            const USER_CREATE: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreate();
            const USER_ENTITY: UserEntity = USER_SERVICE_TEST_DATA.getUserEntity();
            const ALREADY_EXISTS_ERROR: AlreadyExistsError = USER_SERVICE_TEST_DATA.getAlreadyExistsErrorSameUsername();

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(1);
            });

            when(userRepositoryMock.getByName(anyString(), false)).thenCall(async () => {
                return Promise.resolve(USER_ENTITY);
            });

            // Act & Assert
            await expect(userService.createUser(USER_CREATE)).rejects.toThrowError(ALREADY_EXISTS_ERROR);
        });

        it('Should throw NotFoundError when application does not exist', async () => {
            // Arrange
            const USER_CREATE: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreate();
            const NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getApplicationIdNotFoundError(USER_CREATE.applicationId);

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.createUser(USER_CREATE)).rejects.toThrowError(NOT_FOUND_ERROR);
        });

        it('Should return created user when user creation succeeds', async () => {
            // Arrange
            const USER_CREATE: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreate();
            const USER_CREATED_ENTITY: IUserCreated = USER_SERVICE_TEST_DATA.getUserCreated();
            const USER_CREATED_EXPECTED: IUserCreated = USER_SERVICE_TEST_DATA.getUserCreatedExpired();
            const APPLICATION_ID: number = USER_SERVICE_TEST_DATA.getApplicationId();
            const USER_ID = USER_SERVICE_TEST_DATA.getUser().id;

            when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(APPLICATION_ID);
            });

            when(userRepositoryMock.create(anyString(), anyString())).thenCall(async () => {
                return Promise.resolve(USER_ID);
            });

            when(userApplicationRepositoryMock.create(anything(), anything())).thenCall(async () => {
                return Promise.resolve(USER_CREATED_ENTITY);
            });

            when(userEntityToUserCreatedMapperMock.mapWithApplicationId(anything(), anyNumber())).thenReturn(USER_CREATED_EXPECTED);

            // Act
            const result: IUserCreated = await userService.createUser(USER_CREATE);

            // Assert
            expect(result).toEqual(USER_CREATED_EXPECTED);
        });
    });

    describe('updateUser', () => {
        it('Should throw NotFoundError when user does not exist', async () => {
            // Arrange
            const USER_UPDATE: IUserUpdater = USER_SERVICE_TEST_DATA.getUserUpdated();
            const USER_ID_NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getUserIdNotFoundError(USER_UPDATE.id);

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.updateUser(USER_UPDATE.id, USER_UPDATE)).rejects.toThrow(USER_ID_NOT_FOUND_ERROR);
        });

        it('Should return updated user when user update succeeds', async () => {
            // Arrange
            const USER_UPDATE: IUserUpdater = USER_SERVICE_TEST_DATA.getUserUpdated();
            const EXISTING_USER: IUser = USER_SERVICE_TEST_DATA.getUserEntity();

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(EXISTING_USER);
            });

            when(userRepositoryMock.update(USER_UPDATE)).thenCall(async () => {
                return Promise.resolve(USER_UPDATE);
            });

            // Act
            const RESULT: IUser = await userService.updateUser(USER_UPDATE.id, USER_UPDATE);

            // Assert
            expect(RESULT).toEqual(USER_UPDATE);
        });
    });

    describe('getUser', () => {
        it('Should throw NotFoundError when user does not exist', async () => {
            // Arrange
            const USER_ID: number = USER_SERVICE_TEST_DATA.getUserEntity()?.id;
            const USER_ID_NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getUserIdNotFoundError(USER_ID);

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(userService.getUser(USER_ID)).rejects.toThrow(USER_ID_NOT_FOUND_ERROR);
        });

        it('Should return user when user exists', async () => {
            // Arrange
            const USER_ENTITY: UserEntity = USER_SERVICE_TEST_DATA.getUserEntity();
            const USER: IUser = USER_SERVICE_TEST_DATA.getUserEntity();
            const USER_ID: number = USER_ENTITY.id;

            when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(USER_ENTITY);
            });

            when(userEntityToUserMapperMock.map(USER_ENTITY)).thenCall(async () => {
                return Promise.resolve(USER);
            });

            // Act
            const result: IUser = await userService.getUser(USER_ID);

            // Assert
            expect(result).toEqual(USER);
        });
    });

    describe('getAllUsers', () => {
        it('Should return list of users when users exist', async () => {
            // Arrange
            const USER_ENTITY_LIST: UserEntity[] = USER_SERVICE_TEST_DATA.getUserEntityList();
            const EXPECTED_USER_LIST: IUser[] = USER_SERVICE_TEST_DATA.getUserList();

            when(userRepositoryMock.getAll()).thenCall(async () => {
                return USER_ENTITY_LIST;
            });

            when(userEntityToUserMapperMock.mapList(USER_ENTITY_LIST)).thenCall(() => {
                return EXPECTED_USER_LIST;
            });

            // Act
            const USER_LIST: IUser[] = await userService.getAllUsers();

            // Assert
            expect(USER_LIST).toEqual(EXPECTED_USER_LIST);
        });

        it('Should return empty list of users when no users exist', async () => {
            // Arrange
            when(userRepositoryMock.getAll()).thenCall(async () => []);

            when(userEntityToUserMapperMock.mapList(anything())).thenCall(() => {
                return new Array<IUser>();
            });

            // Act
            const USER_LIST: IUser[] = await userService.getAllUsers();

            // Assert
            expect(USER_LIST).toEqual(new Array<IUser>());
        });
    });
});
