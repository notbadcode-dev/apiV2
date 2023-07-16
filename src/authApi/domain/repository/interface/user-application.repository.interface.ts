/* eslint-disable hexagonal-architecture/enforce */
import { ApplicationEntity } from '@entity/application.entity';
import { UserApplicationEntity } from '@entity/user-application.entity';
import { UserEntity } from '@entity/user.entity';

export interface IUserApplicationRepository {
    create(userEntity: UserEntity, applicationEntity: ApplicationEntity): Promise<UserApplicationEntity>;
}
