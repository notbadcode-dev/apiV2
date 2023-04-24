import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { NotFountError } from '@error/not-found.error';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';

export class UserServiceTestData {
    getUserCreate(): IUserCreate {
        return {
            username: this.getUsername(),
            password: this.getUserPassword(),
            applicationId: 1,
        };
    }

    getUserEntity(): UserEntity {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
            hashPassword: () => Promise.resolve(),
        };
    }

    getUserEntityList(): UserEntity[] {
        const userEntityOne: UserEntity = this.getUserEntity();
        const userEntityTwo: UserEntity = {
            ...this.getUserEntity(),
            id: 2,
            hashPassword: () => Promise.resolve(),
        };

        return [userEntityOne, userEntityTwo];
    }

    getUser(): IUser {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
        };
    }

    getUserList(): IUser[] {
        const userOne: IUser = this.getUser();
        const userTwo: IUser = {
            ...this.getUser(),
            id: 2,
        };

        return [userOne, userTwo];
    }

    getUserCreated(): IUserCreated {
        const userCreate: IUserCreate = this.getUserCreate();

        return { ...this.getUserEntity(), applicationId: userCreate.applicationId };
    }

    getUserCreatedExpired(): IUserCreated {
        const userCreated: IUserCreated = this.getUserCreated();

        return {
            id: userCreated.id,
            username: userCreated.username,
            applicationId: userCreated.applicationId,
        };
    }

    getUserUpdated(): IUserUpdater {
        return {
            id: this.getUserId(),
            username: this.getUsername(),
            password: this.getUserPassword(),
        };
    }

    getApplicationId(): number {
        return 1;
    }

    public getUserIdForceError(): number {
        return 2;
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

    public getAlreadyExistsErrorSameUsername(): AlreadyExistsError {
        return new AlreadyExistsError(ERROR_MESSAGE_USER.ALREADY_EXIST_USER_SAME_USERNAME);
    }

    public getApplicationIdNotFoundError(applicationId: number): NotFountError {
        return new NotFountError(ERROR_MESSAGE_APPLICATION.THERE_IS_NOT_APPLICATION_WITH_ID(applicationId));
    }

    public getUserIdNotFoundError(userId: number): NotFountError {
        return new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
    }
}
