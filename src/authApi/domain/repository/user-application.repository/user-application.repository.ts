/* eslint-disable hexagonal-architecture/enforce */
import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { ApplicationEntity } from '@entity/application.entity';
import { UserApplicationEntity } from '@entity/user-application.entity';
import { UserEntity } from '@entity/user.entity';
import { IUserApplicationRepository } from '@repository/user-application.repository/user-application.repository.interface';
import { Inject, Service, Token } from 'typedi';
import { Repository } from 'typeorm';

export const USER_APPLICATION_REPOSITORY_TOKEN = new Token<IUserApplicationRepository>('UserApplicationRepository');
const USER_APPLICATION_ENTITY_REPOSITORY_TOKEN = UserApplicationEntity.name;

@Service(USER_APPLICATION_REPOSITORY_TOKEN)
export class UserApplicationRepository implements IUserApplicationRepository {
    constructor(
        @Inject(USER_APPLICATION_ENTITY_REPOSITORY_TOKEN)
        private _userApplicationRepository: Repository<UserApplicationEntity>
    ) {}

    @LoggerMethodDecorator
    public async create(userEntity: UserEntity, applicationEntity: ApplicationEntity): Promise<UserApplicationEntity> {
        const USER_APPLICATION_ENTITY = new UserApplicationEntity();
        USER_APPLICATION_ENTITY.user = userEntity;
        USER_APPLICATION_ENTITY.application = applicationEntity;

        const SAVED_USER_APPLICATION: UserApplicationEntity = await this._userApplicationRepository.save(USER_APPLICATION_ENTITY);

        if (!SAVED_USER_APPLICATION || !USER_APPLICATION_ENTITY?.id) {
            throw new Error(ERROR_MESSAGE_APPLICATION.COULD_NOT_ASSOCIATE_APPLICATION_AND_USER(applicationEntity.id, userEntity.username));
        }

        return SAVED_USER_APPLICATION;
    }
}
