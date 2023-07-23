import { ERROR_MESSAGE_USER } from '@constant/error-message/error-message-user.constant';
import { UserEntity } from '@entity/user.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import {
    UserUpdaterToUserEntityMapper,
    USER_UPDATER_TO_USER_ENTITY_MAPPER,
} from '@mapper/user/userUpdateToUserEntity.mapper/userUpdateToUserEntity.mapper';
import { TUserUpdater } from '@model/user/user-update.model';
import { IUserRepository } from '@repository/user.repository/user.repository.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service, Token } from 'typedi';
import { DataSource, QueryRunner, Repository, UpdateResult } from 'typeorm';

export const USER_REPOSITORY_TOKEN = new Token<IUserRepository>('UserRepository');
const USER_ENTITY_REPOSITORY_TOKEN = UserEntity.name;

@Service(USER_REPOSITORY_TOKEN)
export class UserRepository implements IUserRepository {
    constructor(
        @Inject(USER_ENTITY_REPOSITORY_TOKEN) private _userRepository: Repository<UserEntity>,
        @Inject(USER_UPDATER_TO_USER_ENTITY_MAPPER) private _userUpdaterToUserEntityMapper: UserUpdaterToUserEntityMapper,
        @Inject() private _dataSource: DataSource
    ) {}

    @LoggerMethodDecorator
    public async create(username: string, password: string): Promise<UserEntity> {
        const NEW_USER: UserEntity = new UserEntity();
        NEW_USER.username = username;
        NEW_USER.password = password;

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_USER: UserEntity = await QUERY_RUNNER.manager.save(NEW_USER);

        if (!SAVED_CREATED_USER || !SAVED_CREATED_USER?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_USER.COULD_NOT_CREATED_USER_WITH_USERNAME(username));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const USER_ENTITY_CREATED: UserEntity = await this.getById(SAVED_CREATED_USER.id);
        return USER_ENTITY_CREATED;
    }

    @LoggerMethodDecorator
    public async update(userUpdate: TUserUpdater): Promise<UserEntity> {
        const USER_ENTITY: UserEntity = this._userUpdaterToUserEntityMapper.map(userUpdate);

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const UPDATED_USER: UpdateResult = await QUERY_RUNNER.manager.update(UserEntity, userUpdate.id, USER_ENTITY);

        if (!UPDATED_USER || !UPDATED_USER?.affected) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_USER.COULD_NOT_UPDATE_USER(userUpdate.username));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const USER_ENTITY_UPDATED: UserEntity = await this.getById(USER_ENTITY.id);
        return USER_ENTITY_UPDATED;
    }

    @LoggerMethodDecorator
    public async getById(userId: number): Promise<UserEntity> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.findOneBy({ id: userId });

        if (!USER_ENTITY || !USER_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
        }

        return USER_ENTITY;
    }

    @LoggerMethodDecorator
    public async getByName(username: string, controlExists?: boolean): Promise<UserEntity | null> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.findOneBy({ username: username });

        if (!controlExists) {
            return USER_ENTITY;
        }

        if (!USER_ENTITY || !USER_ENTITY?.id || !USER_ENTITY.username?.length) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_USERNAME_NOT_FOUND(username));
        }

        return USER_ENTITY;
    }

    @LoggerMethodDecorator
    public async getByNameAndPassword(username: string, password: string): Promise<UserEntity | null> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.findOneBy({ username: username, password: password });

        if (!USER_ENTITY || !USER_ENTITY?.id || !USER_ENTITY.username?.length) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_USERNAME_NOT_FOUND(username));
        }

        return USER_ENTITY;
    }

    @LoggerMethodDecorator
    public async getAll(): Promise<UserEntity[]> {
        const USER_ENTITY_LIST: UserEntity[] = await this._userRepository.find();
        return USER_ENTITY_LIST;
    }
}
