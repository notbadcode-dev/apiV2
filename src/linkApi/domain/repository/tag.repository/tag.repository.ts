import { ERROR_MESSAGE_TAG } from '@constant/error-message/error-message-tag.constant';
import { TagEntity } from '@entity/tag.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import { ITagRepository } from '@repository/tag.repository/tag.repository.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';
import { DataSource, DeleteResult, QueryRunner, Repository } from 'typeorm';

export const TAG_REPOSITORY_TOKEN = new Token<ITagRepository>('TagRepository');
export const TAG_ENTITY_REPOSITORY_TOKEN = TagEntity.name;

@Service(TAG_REPOSITORY_TOKEN)
export class TagRepository {
    //#region Constructor

    constructor(
        @Inject(TAG_ENTITY_REPOSITORY_TOKEN)
        private readonly _tagRepository: Repository<TagEntity>,
        @Inject()
        private _dataSource: DataSource,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService
    ) {}

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public async create(tagEntity: TagEntity): Promise<TagEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_LINK: TagEntity = await QUERY_RUNNER.manager.save(tagEntity);

        if (!SAVED_CREATED_LINK || !SAVED_CREATED_LINK?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_TAG.COULD_NOT_CREATED_TAG_WITH_NAME(tagEntity?.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const CREATED_LINK_ENTITY: TagEntity = await this.getById(SAVED_CREATED_LINK?.id);
        return CREATED_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async getById(tagId: number): Promise<TagEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const TAG_ENTITY: TagEntity | null = await this._tagRepository.findOne({
            where: {
                id: tagId,
                userId: USER_ID,
            },
        });

        if (!TAG_ENTITY || !TAG_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_TAG.TAG_WITH_ID_NOT_FOUND(tagId));
        }

        return TAG_ENTITY;
    }

    @LoggerMethodDecorator
    public async delete(deleteTagId: number): Promise<boolean> {
        const DELETE_TAG_ENTITY: TagEntity | null = await this.getById(deleteTagId);

        if (!DELETE_TAG_ENTITY || !DELETE_TAG_ENTITY?.id) {
            throw new NotFountError(ERROR_MESSAGE_TAG.TAG_WITH_ID_NOT_FOUND(deleteTagId));
        }

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const DELETED_TAG: DeleteResult = await QUERY_RUNNER.manager.delete(TagEntity, DELETE_TAG_ENTITY?.id);

        if (!DELETED_TAG || !DELETED_TAG?.affected) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_TAG.COULD_NOT_DELETE_TAG(DELETE_TAG_ENTITY?.name ?? ''));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        return DELETED_TAG?.affected > 0;
    }

    //#endregion
}
