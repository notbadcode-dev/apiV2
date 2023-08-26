import { UserEntity } from '@entity/user.entity';
import { IUserUpdaterToUserEntityMapper } from '@mapper/user/userUpdateToUserEntity.mapper/userUpdateToUserEntity.mapper.interface';
import { TUserUpdater } from '@model/user/user-update.model';
import { Service, Token } from 'typedi';

export const USER_UPDATER_TO_USER_ENTITY_MAPPER = new Token<IUserUpdaterToUserEntityMapper>('UserUpdaterToUserEntityMapper');

@Service(USER_UPDATER_TO_USER_ENTITY_MAPPER)
export class UserUpdaterToUserEntityMapper implements IUserUpdaterToUserEntityMapper {
    public map(userUpdate: TUserUpdater): UserEntity {
        const USER_ENTITY: UserEntity = new UserEntity();
        USER_ENTITY.id = userUpdate.id;
        USER_ENTITY.username = userUpdate.username;
        USER_ENTITY.password = userUpdate.password;

        return USER_ENTITY;
    }
}
