import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { NotFountError } from '@error/not-found.error';
import { UserEntityToUserMapper } from '@mapper/user/userEntityToUser.mapper/userEntityToUser.mapper';
import { UserEntityToUserCreatedMapper } from '@mapper/user/userEntityToUserCreated.mapper/userEntityToUserCreated.mapper';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { TUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { ApplicationRepository } from '@repository/application.repository/application.repository';
import { UserApplicationRepository } from '@repository/user-application.repository/user-application.repository';
import { UserRepository } from '@repository/user.repository/user.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { UserService } from '@service/user.service/user.service';
import { IUserService } from '@service/user.service/user.service.interface';
import { UserServiceTestData } from '@testData/service/user.service.test.data';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

//#region Attributes

let userService: IUserService;
let userRepositoryMock: UserRepository;
let applicationRepositoryMock: ApplicationRepository;
let userApplicationRepositoryMock: UserApplicationRepository;
let userEntityToUserMapperMock: UserEntityToUserMapper;
let userEntityToUserCreatedMapperMock: UserEntityToUserCreatedMapper;
let globalUtilValidateServiceMock: GlobalUtilValidateService;

//#endregion

//#region Constructor

function generateUserService(): void {
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
}

beforeEach(() => {
    generateUserService();
});

//#endregion

//#region Test data

const USER_SERVICE_TEST_DATA: UserServiceTestData = new UserServiceTestData();

const USER: IUser = USER_SERVICE_TEST_DATA.getUser();
const USER_ENTITY: UserEntity = USER_SERVICE_TEST_DATA.getUserEntity();

//#endregion

describe('createUser', () => {
    const USER_CREATE: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreate();
    const APPLICATION_ID: number = USER_SERVICE_TEST_DATA.getApplicationId();

    it('Should throw an ArgumentError when application id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_NULL: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsNull();

        // Act & Assert
        await expect(userService.createUser(USER_CREATED_WITH_APPLICATION_ID_NULL)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when application id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_ZERO: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithApplicationIdIsZero();

        // Act & Assert
        await expect(userService.createUser(USER_CREATED_WITH_APPLICATION_ID_ZERO)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId()
        );
    });

    it('Should throw an ArgumentError when username is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_USERNAME_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithUsernameIsEmpty();

        // Act & Assert
        await expect(userService.createUser(USER_CREATED_WITH_USERNAME_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUsernameCannotBeEmpty()
        );
    });

    it('Should throw an ArgumentError when password is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_PASSWORD_IS_EMPTY: IUserCreate = USER_SERVICE_TEST_DATA.getUserCreatedWithPasswordIsEmpty();

        // Act & Assert
        await expect(userService.createUser(USER_CREATED_WITH_PASSWORD_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidPasswordCannotBeEmpty()
        );
    });

    it('Should throw AlreadyExistsError when username already exists', async () => {
        // Arrange
        const ALREADY_EXISTS_ERROR: AlreadyExistsError = USER_SERVICE_TEST_DATA.getAlreadyExistsErrorSameUsername();

        when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(APPLICATION_ID);
        });

        when(userRepositoryMock.getByName(anyString(), false)).thenCall(async () => {
            return Promise.resolve(USER_ENTITY);
        });

        // Act & Assert
        await expect(userService.createUser(USER_CREATE)).rejects.toThrowError(ALREADY_EXISTS_ERROR);
    });

    it('Should throw NotFoundError when application does not exist', async () => {
        // Arrange
        const NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getApplicationIdNotFoundError(USER_CREATE.applicationId);

        when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(null);
        });

        // Act & Assert
        await expect(userService.createUser(USER_CREATE)).rejects.toThrowError(NOT_FOUND_ERROR);
    });

    it('Should return created user when user creation succeeds', async () => {
        // Arrange
        const USER_CREATED: IUserCreated = USER_SERVICE_TEST_DATA.getUserCreated();
        const USER_CREATED_EXPECTED: IUserCreated = USER_SERVICE_TEST_DATA.getUserCreatedExpired();

        when(applicationRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(APPLICATION_ID);
        });

        when(userRepositoryMock.create(anyString(), anyString())).thenCall(async () => {
            return Promise.resolve(USER.id);
        });

        when(userApplicationRepositoryMock.create(anything(), anything())).thenCall(async () => {
            return Promise.resolve(USER_CREATED);
        });

        when(userEntityToUserCreatedMapperMock.mapWithApplicationId(anything(), anyNumber())).thenReturn(USER_CREATED_EXPECTED);

        // Act
        const RESULT: IUserCreated = await userService.createUser(USER_CREATE);

        // Assert
        expect(RESULT).toEqual(USER_CREATED_EXPECTED);
    });
});

describe('updateUser', () => {
    const USER_UPDATE: TUserUpdater = USER_SERVICE_TEST_DATA.getUserUpdated();

    it('Should throw an ArgumentError when application id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_NULL: IUser = USER_SERVICE_TEST_DATA.getUserWithApplicationIdIsNull();

        // Act & Assert
        await expect(
            userService.updateUser(USER_CREATED_WITH_APPLICATION_ID_NULL.id, USER_CREATED_WITH_APPLICATION_ID_NULL)
        ).rejects.toThrow(USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId());
    });

    it('Should throw an ArgumentError when application id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_APPLICATION_ID_ZERO: IUser = USER_SERVICE_TEST_DATA.getUserWithApplicationIdIsZero();

        // Act & Assert
        await expect(
            userService.updateUser(USER_CREATED_WITH_APPLICATION_ID_ZERO.id, USER_CREATED_WITH_APPLICATION_ID_ZERO)
        ).rejects.toThrow(USER_SERVICE_TEST_DATA.getArgumentErrorInvalidApplicationId());
    });

    it('Should throw an ArgumentError when user id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_USER_ID_NULL: IUser = USER_SERVICE_TEST_DATA.getUserWithUserIdIsNull();

        // Act & Assert
        await expect(userService.updateUser(USER_CREATED_WITH_USER_ID_NULL.id, USER_CREATED_WITH_USER_ID_NULL)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUserId()
        );
    });

    it('Should throw an ArgumentError when user id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_USER_ID_ZERO: IUser = USER_SERVICE_TEST_DATA.getUserWithUserIdIsZero();

        // Act & Assert
        await expect(userService.updateUser(USER_CREATED_WITH_USER_ID_ZERO.id, USER_CREATED_WITH_USER_ID_ZERO)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUserId()
        );
    });

    it('Should throw an ArgumentError when username is empty', async () => {
        // Arrange
        const USER_CREATED_WITH_USERNAME_IS_EMPTY: IUser = USER_SERVICE_TEST_DATA.getUserWithUsernameIsEmpty();

        // Act & Assert
        await expect(userService.updateUser(USER_CREATED_WITH_USERNAME_IS_EMPTY.id, USER_CREATED_WITH_USERNAME_IS_EMPTY)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUsernameCannotBeEmpty()
        );
    });

    it('Should throw NotFoundError when user does not exist', async () => {
        // Arrange
        const USER_ID_NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getUserIdNotFoundError(USER_UPDATE.id);

        when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(null);
        });

        // Act & Assert
        await expect(userService.updateUser(USER_UPDATE.id, USER_UPDATE)).rejects.toThrow(USER_ID_NOT_FOUND_ERROR);
    });

    it('Should return updated user when user update succeeds', async () => {
        // Arrange
        when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(USER_ENTITY);
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
    it('Should throw an ArgumentError when user id is null', async () => {
        // Arrange
        const USER_CREATED_WITH_USER_ID_NULL: IUser = USER_SERVICE_TEST_DATA.getUserWithUserIdIsNull();

        // Act & Assert
        await expect(userService.getUser(USER_CREATED_WITH_USER_ID_NULL.id)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUserId()
        );
    });

    it('Should throw an ArgumentError when user id is zero', async () => {
        // Arrange
        const USER_CREATED_WITH_USER_ID_ZERO: IUser = USER_SERVICE_TEST_DATA.getUserWithUserIdIsZero();

        // Act & Assert
        await expect(userService.getUser(USER_CREATED_WITH_USER_ID_ZERO.id)).rejects.toThrow(
            USER_SERVICE_TEST_DATA.getArgumentErrorInvalidUserId()
        );
    });

    it('Should throw NotFoundError when user does not exist', async () => {
        // Arrange
        const USER_ID_NOT_FOUND_ERROR: NotFountError = USER_SERVICE_TEST_DATA.getUserIdNotFoundError(USER_ENTITY.id);

        when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(null);
        });

        // Act & Assert
        await expect(userService.getUser(USER_ENTITY.id)).rejects.toThrow(USER_ID_NOT_FOUND_ERROR);
    });

    it('Should return user when user exists', async () => {
        // Arrange
        when(userRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(USER_ENTITY);
        });

        when(userEntityToUserMapperMock.map(USER_ENTITY)).thenCall(async () => {
            return Promise.resolve(USER);
        });

        // Act
        const RESULT: IUser = await userService.getUser(USER_ENTITY.id);

        // Assert
        expect(RESULT).toEqual(USER);
    });
});

describe('getAllUserList', () => {
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
        const USER_LIST: IUser[] = await userService.getAllUserList();

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
        const USER_LIST: IUser[] = await userService.getAllUserList();

        // Assert
        expect(USER_LIST).toEqual(new Array<IUser>());
    });
});
