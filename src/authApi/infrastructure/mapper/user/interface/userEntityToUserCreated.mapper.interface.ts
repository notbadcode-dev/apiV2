import { UserEntity } from '@entity/user.entity';
import { IUserCreated } from '@model/user/user-create.model';

export interface IUserEntityToUserCreatedMapper {
    mapWithApplicationId(userEntity: UserEntity, applicationId: number): IUserCreated;
}
