import { UserEntity } from '@entity/user.entity';
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
}
