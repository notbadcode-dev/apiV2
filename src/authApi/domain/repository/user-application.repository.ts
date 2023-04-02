// eslint-disable-next-line hexagonal-architecture/enforce
import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
// eslint-disable-next-line hexagonal-architecture/enforce
import { ApplicationEntity } from '../entity/application.entity';
// eslint-disable-next-line hexagonal-architecture/enforce
import { UserApplicationEntity } from '../entity/user-application.entity';
import { UserEntity } from '../entity/user.entity';

@Service()
export class UserApplicationRepository {
    constructor(
        @Inject(UserApplicationEntity.name)
        private _userApplicationRepository: Repository<UserApplicationEntity>
    ) {}

    @LoggerMethodDecorator
    public async create(userEntity: UserEntity, applicationEntity: ApplicationEntity): Promise<UserApplicationEntity> {
        const USER_APPLICATION_ENTITY = new UserApplicationEntity();
        USER_APPLICATION_ENTITY.user = userEntity;
        USER_APPLICATION_ENTITY.application = applicationEntity;

        const SAVED_USER_APPLICATION = await this._userApplicationRepository.save(USER_APPLICATION_ENTITY);

        if (!SAVED_USER_APPLICATION || !USER_APPLICATION_ENTITY?.id) {
            throw new Error(ERROR_MESSAGE_APPLICATION.COULD_NOT_ASSOCIATE_APPLICATION_AND_USER(applicationEntity.id, userEntity.username));
        }

        return SAVED_USER_APPLICATION;
    }
}
