import { UserEntity } from '@entity/user.entity';
import { IUserUpdater } from '@model/user/user-update.model';
import { Service } from 'typedi';

@Service()
export class UserUpdaterToUserEntityMapper {
    public map(userUpdate: IUserUpdater): UserEntity {
        const USER_ENTITY: UserEntity = new UserEntity();
        USER_ENTITY.id = userUpdate.id;
        USER_ENTITY.username = userUpdate.username;
        USER_ENTITY.password = userUpdate.password;

        return USER_ENTITY;
    }
}
