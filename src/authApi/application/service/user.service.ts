import { ERROR_MESSAGE_APPLICATION } from '@constant/error-message/error-message-application.constant';
import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { LoggerMethodDecorator } from '@decorator/logger-method.decorator';
import { ApplicationEntity } from '@entity/application.entity';
import { UserApplicationEntity } from '@entity/user-application.entity';
import { UserEntity } from '@entity/user.entity';
import { AlreadyExistsError } from '@error/already-exists.error';
import { ArgumentError } from '@error/argument.error';
import { NotFountError } from '@error/not-found.error';
import { UserEntityToUserMapper } from '@mapper/user/userEntityToUser.mapper';
import { UserEntityToUserCreatedMapper } from '@mapper/user/userEntityToUserCreated.mapper';
import { IUserCreate, IUserCreated } from '@model/user/user-create.model';
import { IUserUpdater } from '@model/user/user-update.model';
import { IUser } from '@model/user/user.model';
import { ApplicationRepository } from '@repository/application.repository';
import { UserApplicationRepository } from '@repository/user-application.repository';
import { UserRepository } from '@repository/user.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { IUserService } from '@service/interface/user.service.interface';
import { Inject, Service, Token } from 'typedi';

export const USER_SERVICE_TOKEN = new Token<IUserService>('UserService');

@Service(USER_SERVICE_TOKEN)
export class UserService implements IUserService {
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
        this.validateArgumentOnCreateUser(createUser);

        await this.controlExistsApplication(createUser.applicationId);
        await this.controlDuplicateUserWithUsername(createUser.username);

        const USER_CREATED_SAVED: UserEntity = await this._userRepository.create(createUser.username, createUser.password);

        await this.addUserToApplication(USER_CREATED_SAVED.id, createUser.applicationId);

        const USER_CREATED: IUserCreated = this._userEntityToUserCreatedMapper.mapWithApplicationId(
            USER_CREATED_SAVED,
            createUser.applicationId
        );

        return USER_CREATED;
    }

    @LoggerMethodDecorator
    public async updateUser(userId: number, userUpdate: IUserUpdater): Promise<IUserUpdater> {
        this.validateArgumentOnUpdateUser(userUpdate);

        this._globalUtilValidateService.controlSameIdOnParamAndBody(userId, userUpdate.id);
        await this.controlExistsUser(userId);
        const USER_UPDATED: UserEntity = await this._userRepository.update(userUpdate);
        return USER_UPDATED;
    }

    @LoggerMethodDecorator
    public async getUser(userId: number): Promise<IUser> {
        this.validateUserId(userId);
        await this.controlExistsUser(userId);

        const USER_ENTITY: UserEntity = await this._userRepository.getById(userId);
        const USER: IUser = this._userEntityToUserMapper.map(USER_ENTITY);
        return USER;
    }

    @LoggerMethodDecorator
    public async getAllUserList(): Promise<IUser[]> {
        const USER_ENTITY_LIST: UserEntity[] = await this._userRepository.getAll();
        const USER_LIST: IUser[] = this._userEntityToUserMapper.mapList(USER_ENTITY_LIST);
        return USER_LIST;
    }

    @LoggerMethodDecorator
    private validateArgumentOnCreateUser(createUser: IUserCreate): void {
        this.validateApplicationId(createUser?.applicationId ?? null);
        this.validateUsername(createUser?.username ?? '');
        this.validatePassword(createUser?.password ?? '');
    }

    @LoggerMethodDecorator
    private validateArgumentOnUpdateUser(userUpdate: IUserUpdater): void {
        this.validateApplicationId(userUpdate?.applicationId ?? null);
        this.validateUserId(userUpdate?.id ?? null);
        this.validateUsername(userUpdate?.username ?? '');
    }

    @LoggerMethodDecorator
    private validateApplicationId(applicationId?: number | null): void {
        if (!applicationId || applicationId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_USER.INVALID_APPLICATION_ID);
        }
    }

    @LoggerMethodDecorator
    private validateUserId(userId?: number | null): void {
        if (!userId || isNaN(Number(userId)) || userId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_USER.INVALID_USER_ID);
        }
    }

    @LoggerMethodDecorator
    private validateUsername(username: string): void {
        if (!username?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_USER.USERNAME_CANNOT_BE_EMPTY);
        }
    }

    @LoggerMethodDecorator
    private validatePassword(password: string): void {
        if (!password?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_USER.PASSWORD_CANNOT_BE_EMPTY);
        }
    }

    @LoggerMethodDecorator
    private async controlDuplicateUserWithUsername(username: string): Promise<void> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.getByName(username, false);

        if (USER_ENTITY) {
            throw new AlreadyExistsError(ERROR_MESSAGE_USER.ALREADY_EXIST_USER_SAME_USERNAME);
        }
    }

    @LoggerMethodDecorator
    private async controlExistsUser(userId: number): Promise<void> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.getById(userId);

        if (!USER_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
        }
    }

    @LoggerMethodDecorator
    private async controlExistsApplication(applicationId: number): Promise<void> {
        const APPLICATION_ENTITY: ApplicationEntity = await this._applicationRepository.getById(applicationId);

        if (!APPLICATION_ENTITY) {
            throw new NotFountError(ERROR_MESSAGE_APPLICATION.THERE_IS_NOT_APPLICATION_WITH_ID(applicationId));
        }
    }

    @LoggerMethodDecorator
    private async addUserToApplication(userId: number, applicationId: number): Promise<void> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.getById(userId);
        const APPLICATION_ENTITY: ApplicationEntity | null = await this._applicationRepository.getById(applicationId);

        const USER_APPLICATION_SAVED: UserApplicationEntity = await this._userApplicationRepository.create(USER_ENTITY, APPLICATION_ENTITY);

        if (!USER_APPLICATION_SAVED || !USER_APPLICATION_SAVED?.id) {
            throw new Error(ERROR_MESSAGE_APPLICATION.COULD_NOT_ASSOCIATE_APPLICATION_AND_USER(applicationId, USER_ENTITY.username));
        }
    }
}
