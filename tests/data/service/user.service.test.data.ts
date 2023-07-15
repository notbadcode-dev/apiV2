import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { ArgumentError } from '@error/argument.error';
import { NotFountError } from '@error/not-found.error';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';

type NullableUserCreated = IUserCreated & { applicationId: null };

export class UserServiceTestData {
    public getUserCreate(): IUserCreate {
        return {
            username: this.getUsername(),
            password: this.getUserPassword(),
            applicationId: 1,
        };
    }

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
        const userEntityOne: UserEntity = this.getUserEntity();
        const userEntityTwo: UserEntity = {
            ...this.getUserEntity(),
            id: 2,
            hashPassword: () => Promise.resolve(),
        };

        return [userEntityOne, userEntityTwo];
    }

    public getUser(): IUser {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
        };
    }

    public getUserList(): IUser[] {
        const userOne: IUser = this.getUser();
        const userTwo: IUser = {
            ...this.getUser(),
            id: 2,
        };

        return [userOne, userTwo];
    }

    public getUserCreated(): IUserCreated {
        const userCreate: IUserCreate = this.getUserCreate();

        return { ...this.getUserEntity(), applicationId: userCreate.applicationId };
    }

    public getUserCreatedExpired(): IUserCreated {
        const userCreated: IUserCreated = this.getUserCreated();

        return {
            id: userCreated.id,
            username: userCreated.username,
            applicationId: userCreated.applicationId,
        };
    }

    public getUserUpdated(): IUserUpdater {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
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

    public getApplicationId(): number {
        return 1;
    }

    public getSuccessfullyCreated(): boolean {
        return true;
    }

    public getNotSuccessfullyCreated(): boolean {
        return false;
    }

    public getArgumentErrorInvalidApplicationId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_USER.INVALID_APPLICATION_ID);
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
