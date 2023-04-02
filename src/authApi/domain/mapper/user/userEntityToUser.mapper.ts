import { UserEntity } from '@entity/user.entity';
import { IUser } from '@model/user/user.model';
import { Service } from 'typedi';

@Service()
export class UserEntityToUserMapper {
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
