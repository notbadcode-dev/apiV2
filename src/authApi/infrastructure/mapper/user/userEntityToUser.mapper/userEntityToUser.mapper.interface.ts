import { UserEntity } from '@entity/user.entity';
import { IUser } from '@model/user/user.model';

export interface IUserEntityToUserMapper {
    map(userEntity: UserEntity): IUser;

    mapList(userEntityList: UserEntity[]): IUser[];
}
