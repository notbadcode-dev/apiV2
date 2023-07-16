import { UserEntity } from '@entity/user.entity';
import { IUserUpdater } from '@model/user/user-update.model';

export interface IUserRepository {
    create(username: string, password: string): Promise<UserEntity>;

    update(userUpdate: IUserUpdater): Promise<UserEntity>;

    getById(userId: number): Promise<UserEntity>;

    getByName(username: string, controlExists?: boolean): Promise<UserEntity | null>;

    getByNameAndPassword(username: string, password: string): Promise<UserEntity | null>;

    getAll(): Promise<UserEntity[]>;
}
