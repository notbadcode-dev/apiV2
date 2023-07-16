import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { TUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import 'reflect-metadata';

export interface IUserService {
    createUser(createUser: IUserCreate): Promise<IUserCreated>;

    updateUser(userId: number, userUpdate: TUserUpdater): Promise<TUserUpdater>;

    getUser(userId: number): Promise<IUser>;

    getAllUserList(): Promise<IUser[]>;
}
