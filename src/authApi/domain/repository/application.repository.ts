// eslint-disable-next-line hexagonal-architecture/enforce
import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
// eslint-disable-next-line hexagonal-architecture/enforce
import { ApplicationEntity } from '../entity/application.entity';

@Service()
export class ApplicationRepository {
    constructor(@Inject(ApplicationEntity.name) private _applicationRepository: Repository<ApplicationEntity>) {}

    @LoggerMethodDecorator
    public async getById(applicationId: number): Promise<ApplicationEntity> {
        const APPLICATION_ENTITY: ApplicationEntity | null = await this._applicationRepository.findOneBy({ id: applicationId });

        if (!APPLICATION_ENTITY) {
            throw new Error(ERROR_MESSAGE_APPLICATION.APPLICATION_WITH_ID_NOT_FOUND(applicationId));
        }

        return APPLICATION_ENTITY;
    }
}
