import { UserEntity } from 'authApi/domain/entity/user.entity';
import { IUserCreated } from 'authApi/domain/model/user/user-create.model';
import { Service } from 'typedi';

@Service()
export class UserEntityToUserCreatedMapper {
    public mapWithApplicationId(userEntity: UserEntity, applicationId: number): IUserCreated {
        const CREATED_USER: IUserCreated = {
            id: userEntity.id,
            username: userEntity.username,
            applicationId: applicationId,
        };

        return CREATED_USER;
    }
}
