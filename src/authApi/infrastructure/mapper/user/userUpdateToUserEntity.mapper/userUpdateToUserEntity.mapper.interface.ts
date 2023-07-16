import { UserEntity } from '@entity/user.entity';
import { IUserUpdater } from '@model/user/user-update.model';

export interface IUserUpdaterToUserEntityMapper {
    map(userUpdate: IUserUpdater): UserEntity;
}
