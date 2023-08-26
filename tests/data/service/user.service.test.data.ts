import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { ArgumentError } from '@error/argument.error';
import { NotFountError } from '@error/not-found.error';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { TUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';

export class UserServiceTestData {
    //#region Public methods

    //#region return UserEntity

    public getUserEntity(): UserEntity {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
            hashPassword: () => Promise.resolve(),
        };
    }

    public getUserEntityWithUserIdZero(): UserEntity {
        return {
            ...this.getUserEntity(),
            id: 0,
            hashPassword: () => Promise.resolve(),
        };
    }

    public getUserEntityList(): UserEntity[] {
        const USER_ENTITY_ONE: UserEntity = this.getUserEntity();
        const USER_ENTITY_TWO: UserEntity = {
            ...this.getUserEntity(),
            id: 2,
            hashPassword: () => Promise.resolve(),
        };

        return [USER_ENTITY_ONE, USER_ENTITY_TWO];
    }

    //#endregion

    //#region return IUser

    public getUser(): IUser {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
        };
    }

    public getUserList(): IUser[] {
        const USER_ONE: IUser = this.getUser();
        const USER_TWO: IUser = {
            ...this.getUser(),
            id: 2,
        };

        return [USER_ONE, USER_TWO];
    }

    public getUserWithApplicationIdIsNull(): IUser {
        return {
            ...this.getUser(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            applicationId: null as any,
        };
    }

    public getUserWithApplicationIdIsZero(): IUser {
        return {
            ...this.getUserUpdated(),
            applicationId: 0,
        };
    }

    public getUserWithUsernameIsEmpty(): IUser {
        return {
            ...this.getUserUpdated(),
            applicationId: 10,
            username: '',
        };
    }

    public getUserWithUserIdIsNull(): IUser {
        return {
            ...this.getUserUpdated(),
            applicationId: 10,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: null as any,
        };
    }

    public getUserWithUserIdIsZero(): IUser {
        return {
            ...this.getUserUpdated(),
            applicationId: 10,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: 0,
        };
    }

    //#endregion

    //#region return IUserCreate

    public getUserCreate(): IUserCreate {
        return {
            username: this.getUsername(),
            password: this.getUserPassword(),
            applicationId: 1,
        };
    }

    public getUserCreatedWithApplicationIdIsNull(): IUserCreate {
        return {
            ...this.getUserUpdated(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            applicationId: null as any,
        };
    }

    public getUserCreatedWithApplicationIdIsZero(): IUserCreate {
        return {
            ...this.getUserUpdated(),
            applicationId: 0,
        };
    }

    public getUserCreatedWithUsernameIsEmpty(): IUserCreate {
        return {
            ...this.getUserUpdated(),
            applicationId: 10,
            username: '',
        };
    }

    public getUserCreatedWithPasswordIsEmpty(): IUserCreate {
        return {
            ...this.getUserUpdated(),
            applicationId: 10,
            password: '',
        };
    }

    //#endregion

    //#region return IUserCreate

    public getUserCreated(): IUserCreated {
        const USER_CREATE: IUserCreate = this.getUserCreate();

        return { ...this.getUserEntity(), applicationId: USER_CREATE.applicationId };
    }

    public getUserCreatedExpired(): IUserCreated {
        const USER_CREATED: IUserCreated = this.getUserCreated();

        return {
            id: USER_CREATED.id,
            username: USER_CREATED.username,
            applicationId: USER_CREATED.applicationId,
        };
    }

    //#endregion

    //#region return TUserUpdater

    public getUserUpdated(): TUserUpdater {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
            applicationId: this.getApplicationId(),
        };
    }

    //#endregion

    //#region return throw exception

    public getArgumentErrorInvalidApplicationId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_USER.INVALID_APPLICATION_ID);
    }

    public getArgumentErrorInvalidUserId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_USER.INVALID_USER_ID);
    }

    public getArgumentErrorInvalidUsernameCannotBeEmpty(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_USER.USERNAME_CANNOT_BE_EMPTY);
    }

    public getArgumentErrorInvalidPasswordCannotBeEmpty(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_USER.PASSWORD_CANNOT_BE_EMPTY);
    }

    public getAlreadyExistsErrorSameUsername(): AlreadyExistsError {
        return new AlreadyExistsError(ERROR_MESSAGE_USER.ALREADY_EXIST_USER_SAME_USERNAME);
    }

    public getApplicationIdNotFoundError(applicationId: number): NotFountError {
        return new NotFountError(ERROR_MESSAGE_APPLICATION.THERE_IS_NOT_APPLICATION_WITH_ID(applicationId));
    }

    public getUserIdNotFoundError(userId: number): NotFountError {
        return new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
    }

    //#endregion

    //#endregion

    public getApplicationId(): number {
        return 1;
    }

    public getSuccessfullyCreated(): boolean {
        return true;
    }

    public getNotSuccessfullyCreated(): boolean {
        return false;
    }

    private getUserId(): number {
        return 1;
    }

    private getUsername(): string {
        return 'testUsername';
    }

    private getUserPassword(): string {
        return 'testPassword';
    }
}
