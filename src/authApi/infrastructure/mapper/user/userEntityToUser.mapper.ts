import { UserEntity } from '@entity/user.entity';
import { IUserEntityToUserMapper } from '@interface/userEntityToUser.mapper.interface';
import { IUser } from '@model/user/user.model';
import { Service, Token } from 'typedi';

export const USER_ENTITY_TO_USER_MAPPER = new Token<IUserEntityToUserMapper>('UserEntityToUserMapper');

@Service(USER_ENTITY_TO_USER_MAPPER)
export class UserEntityToUserMapper implements IUserEntityToUserMapper {
    public map(userEntity: UserEntity): IUser {
        const USER: IUser = {
            id: userEntity.id,
            username: userEntity.username,
            password: userEntity.password,
        };

        return USER;
    }

    public mapList(userEntityList: UserEntity[]): IUser[] {
        if (!userEntityList.length) {
            return new Array<IUser>();
        }

        const USER_LIST: IUser[] = userEntityList.map((userEntity: UserEntity) => {
            return this.map(userEntity);
        });

        return USER_LIST;
    }
}
