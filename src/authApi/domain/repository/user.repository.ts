import { InternalServerError } from 'routing-controllers';
import { ERROR_MESSAGE_USER } from 'shared/constant/error-message/error-message-user.constant';
import { NotFountError } from 'shared/error/not-found.error';
import { loggerMethod } from 'shared/service/decorator/logger-method.decorator';
import { GlobalUtilStringService } from 'shared/service/global/global.util.string.service';
import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserUpdaterToUserEntityMapper } from '../mapper/user/userUpdateToUserEntity.mapper';
import { IUserUpdater } from '../model/user/user-update.model';

@Service()
export class UserRepository {
    constructor(
        @Inject(UserEntity.name) private _userRepository: Repository<UserEntity>,
        @Inject() private _userUpdaterToUserEntityMapper: UserUpdaterToUserEntityMapper,
        @Inject() private _globalUtilStringService: GlobalUtilStringService,
        @Inject() private _dataSource: DataSource
    ) {}

    @loggerMethod
    public async create(username: string, password: string): Promise<UserEntity> {
        const NEW_USER: UserEntity = new UserEntity();
        NEW_USER.username = username;
        NEW_USER.password = password;

        const queryRunner = this._dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        const SAVED_CREATED_USER = await queryRunner.manager.save(NEW_USER);

        if (!SAVED_CREATED_USER || !SAVED_CREATED_USER?.id) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_USER.COULD_NOT_CREATED_USER_WITH_USERNAME(username));
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return await this.getById(SAVED_CREATED_USER.id);
    }

    @loggerMethod
    public async update(userUpdate: IUserUpdater): Promise<UserEntity> {
        const USER_ENTITY: UserEntity = this._userUpdaterToUserEntityMapper.map(userUpdate);

        const queryRunner = this._dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        const UPDATED_USER = await queryRunner.manager.update(UserEntity, userUpdate.id, USER_ENTITY);

        if (!UPDATED_USER || !UPDATED_USER?.affected) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_USER.COULD_NOT_UPDATE_USER(userUpdate.username));
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return await this.getById(USER_ENTITY.id);
    }

    @loggerMethod
    public async getById(userId: number): Promise<UserEntity> {
        const USER_ENTITY: UserEntity | null = await this._userRepository.findOneBy({ id: userId });

        if (!USER_ENTITY || !USER_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_USER.USER_WITH_ID_NOT_FOUND(userId));
        }

        return USER_ENTITY;
    }

    @loggerMethod
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

    @loggerMethod
    public async getAll(): Promise<UserEntity[]> {
        const USER_ENTITY_LIST: UserEntity[] = await this._userRepository.find();
        return USER_ENTITY_LIST;
    }
}
