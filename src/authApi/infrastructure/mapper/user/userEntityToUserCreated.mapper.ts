import { UserEntity } from '@entity/user.entity';
import { IUserEntityToUserCreatedMapper } from '@interface/userEntityToUserCreated.mapper.interface';
import { IUserCreated } from '@model/user/user-create.model';
import { Service, Token } from 'typedi';

export const USER_ENTITY_TO_USER_CREATED_MAPPER = new Token<IUserEntityToUserCreatedMapper>('UserEntityToUserCreatedMapper');

@Service(USER_ENTITY_TO_USER_CREATED_MAPPER)
export class UserEntityToUserCreatedMapper implements IUserEntityToUserCreatedMapper {
    public mapWithApplicationId(userEntity: UserEntity, applicationId: number): IUserCreated {
        const CREATED_USER: IUserCreated = {
            id: userEntity.id,
            username: userEntity.username,
            applicationId: applicationId,
        };

        return CREATED_USER;
    }
}
