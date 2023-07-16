// eslint-disable-next-line hexagonal-architecture/enforce
import { ApplicationEntity } from '@entity/application.entity';

export interface IApplicationRepository {
    getById(applicationId: number): Promise<ApplicationEntity>;
}
