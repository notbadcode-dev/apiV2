import { UserEntity } from '@entity/user.entity';
import { TUserUpdater } from '@model/user/user-update.model';

export interface IUserUpdaterToUserEntityMapper {
    map(userUpdate: TUserUpdater): UserEntity;
}
