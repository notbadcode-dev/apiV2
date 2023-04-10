import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { NotFountError } from '@error/not-found.error';
import { UserEntityToUserMapper } from '@mapper/user/userEntityToUser.mapper';
import { UserEntityToUserCreatedMapper } from '@mapper/user/userEntityToUserCreated.mapper';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { ApplicationRepository } from '@repository/application.repository';
import { UserApplicationRepository } from '@repository/user-application.repository';
import { UserRepository } from '@repository/user.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { Inject, Service } from 'typedi';

import { ApplicationEntity } from '../../domain/entity/application.entity';
import { IUser } from '../../domain/model/user/user.model';

@Service()
export class UserService {
    constructor(
        @Inject() private _userRepository: UserRepository,
        @Inject() private _applicationRepository: ApplicationRepository,
        @Inject() private _userApplicationRepository: UserApplicationRepository,
        @Inject() private _userEntityToUserMapper: UserEntityToUserMapper,
        @Inject() private _userEntityToUserCreatedMapper: UserEntityToUserCreatedMapper,
        @Inject() private _globalUtilValidateService: GlobalUtilValidateService
    ) {}

    @LoggerMethodDecorator
    public async createUser(createUser: IUserCreate): Promise<IUserCreated> {
        await this.controlExistsApplication(createUser.applicationId);
        await this.controlDuplicateUserWithUsername(createUser.username);

        const USER_CREATED_SAVED = await this._userRepository.create(createUser.username, createUser.password);

        await this.addUserToApplication(USER_CREATED_SAVED.id, createUser.applicationId);

        const USER_CREATED: IUserCreated = this._userEntityToUserCreatedMapper.mapWithApplicationId(
            USER_CREATED_SAVED,
            createUser.applicationId
        );

        return USER_CREATED;
    }

    @LoggerMethodDecorator
    public async updateUser(userId: number, userUpdate: IUserUpdater): Promise<IUserUpdater> {
        this._globalUtilValidateService.controlSameIdOnParamAndBody(userId, userUpdate.id);
        await this.controlExistsUser(userId);
        const USER_UPDATED = await this._userRepository.update(userUpdate);
        return USER_UPDATED;
    }

    @LoggerMethodDecorator
    public async getUser(userId: number): Promise<IUser> {
        await this.controlExistsUser(userId);

        const USER_ENTITY = await this._userRepository.getById(userId);
        return this._userEntityToUserMapper.map(USER_ENTITY);
    }

    @LoggerMethodDecorator
    public async getAllUsers(): Promise<IUser[]> {
        const USER_ENTITY_LIST = await this._userRepository.getAll();
        const USER_LIST = this._userEntityToUserMapper.mapList(USER_ENTITY_LIST);
        return USER_LIST;
    }

    @LoggerMethodDecorator
    private async controlDuplicateUserWithUsername(username: string): Promise<void> {
        const USER_ENTITY = await this._userRepository.getByName(username, false);

        if (USER_ENTITY) {
            throw new AlreadyExistsError(ERROR_MESSAGE_USER.ALREADY_EXIST_USER_SAME_USERNAME);
        }
    }

    @LoggerMethodDecorator
    private async controlExistsUser(userId: number): Promise<void> {
        const USER_ENTITY = await this._userRepository.getById(userId);

        if (!USER_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
        }
    }

    @LoggerMethodDecorator
    private async controlExistsApplication(applicationId: number): Promise<void> {
        const APPLICATION_ENTITY = await this._applicationRepository.getById(applicationId);

        if (!APPLICATION_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_APPLICATION.THERE_IS_NOT_APPLICATION_WITH_ID(applicationId));
        }
    }

    @LoggerMethodDecorator
    private async addUserToApplication(userId: number, applicationId: number): Promise<void> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.getById(userId);
        const APPLICATION_ENTITY: ApplicationEntity | null = await this._applicationRepository.getById(applicationId);

        const APPLICATION_USER_SAVED = await this._userApplicationRepository.create(USER_ENTITY, APPLICATION_ENTITY);

        if (!APPLICATION_USER_SAVED || !APPLICATION_USER_SAVED?.id) {
            throw new Error(ERROR_MESSAGE_APPLICATION.COULD_NOT_ASSOCIATE_APPLICATION_AND_USER(applicationId, USER_ENTITY.username));
        }
    }
}
