import { UserEntity } from 'authApi/domain/entity/user.entity';
import { IUser } from 'authApi/domain/model/user/user.model';
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
}
