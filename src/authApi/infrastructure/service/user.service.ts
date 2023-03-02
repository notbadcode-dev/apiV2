import { UserEntity } from 'authApi/domain/entity/user.entity';
import { UserEntityToUserMapper } from 'authApi/domain/mapper/user/userEntityToUser.mapper';
import { UserEntityToUserCreatedMapper } from 'authApi/domain/mapper/user/userEntityToUserCreated.mapper';
import { IUserCreate, IUserCreated } from 'authApi/domain/model/user/user-create.model';
import { IUserUpdater } from 'authApi/domain/model/user/user-update.model';
import { ApplicationRepository } from 'authApi/domain/repository/application.repository';
import { UserApplicationRepository } from 'authApi/domain/repository/user-application.repository';
import { UserRepository } from 'authApi/domain/repository/user.repository';
import { ERROR_MESSAGE_APPLICATION } from 'shared/constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from 'shared/constant/error-message/error-message-user.constant';
import { AlreadyExistsError } from 'shared/error/already-exists.error';
import { NotFountError } from 'shared/error/not-found.error';
import { loggerMethod } from 'shared/service/decorator/logger-method.decorator';
import { GlobalUtilStringService } from 'shared/service/global/global.util.string.service';
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
        @Inject() private _globalUtilStringService: GlobalUtilStringService
    ) {}

    @loggerMethod
    public async getAllUsers(): Promise<IUser[]> {
        const USER_ENTITY_LIST = await this._userRepository.getAll();
        return USER_ENTITY_LIST.map(this._userEntityToUserMapper.map);
    }

    @loggerMethod
    public async getUser(userId: number): Promise<IUser> {
        const USER_ENTITY = await this._userRepository.getById(userId);
        return this._userEntityToUserMapper.map(USER_ENTITY);
    }

    @loggerMethod
    public async createUser(createUser: IUserCreate): Promise<IUserCreated> {
        await this.controlExistsApplication(createUser.applicationId);
        await this.controlDuplicateUserWithUsername(createUser.username);

        const SAVED_CREATED_USER = await this._userRepository.create(createUser.username, createUser.password);

        await this.addUserToApplication(SAVED_CREATED_USER.id, createUser.applicationId);

        const CREATED_USER: IUserCreated = this._userEntityToUserCreatedMapper.mapWithApplicationId(SAVED_CREATED_USER, createUser.applicationId);

        return CREATED_USER;
    }

    @loggerMethod
    public async updateUser(userId: number, userUpdate: IUserUpdater): Promise<IUserUpdater> {
        await this.controlExistsUser(userId);
        const UPDATED_USER = await this._userRepository.update(userUpdate);
        return UPDATED_USER;
    }

    @loggerMethod
    private async controlDuplicateUserWithUsername(username: string): Promise<void> {
        const USER_ENTITY = await this._userRepository.getByName(username, false);

        if (USER_ENTITY) {
            throw new AlreadyExistsError(ERROR_MESSAGE_USER.ALREADY_EXIST_USER_SAME_USERNAME);
        }
    }

    @loggerMethod
    private async controlExistsUser(userId: number): Promise<void> {
        const USER_ENTITY = await this._userRepository.getById(userId);

        if (!USER_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
        }
    }

    @loggerMethod
    private async controlExistsApplication(applicationId: number): Promise<void> {
        const APPLICATION_ENTITY = await this._applicationRepository.getById(applicationId);

        if (!APPLICATION_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_APPLICATION.THERE_IS_NOT_APPLICATION_WITH_ID(applicationId));
        }
    }

    @loggerMethod
    private async addUserToApplication(userId: number, applicationId: number): Promise<void> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.getById(userId);
        const APPLICATION_ENTITY: ApplicationEntity | null = await this._applicationRepository.getById(applicationId);

        const SAVED_USER_APPLICATION = await this._userApplicationRepository.create(USER_ENTITY, APPLICATION_ENTITY);

        if (!SAVED_USER_APPLICATION || !SAVED_USER_APPLICATION?.id) {
            throw new Error(ERROR_MESSAGE_APPLICATION.COULD_NOT_ASSOCIATE_APPLICATION_AND_USER(applicationId, USER_ENTITY.username));
        }
    }
}
