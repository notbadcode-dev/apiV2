import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { PAGINATE_CONSTANT } from '@constant/paginate.constant';
import { LinkEntity } from '@entity/link.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import { ILink } from '@model/link/link.model';
import {
    IPaginateCalculateRequest,
    IPaginateCalculateResult,
    IPaginateItem,
    PaginateCalculateHelper,
} from '@model/pagination-item/pagination-item.model';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { NotFoundError } from 'routing-controllers';
import { Inject, Service, Token } from 'typedi';
import { DataSource, DeleteResult, In, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { ILinkRepository } from './link.repository.interface';

export const LINK_REPOSITORY_TOKEN = new Token<ILinkRepository>('LinkRepository');
export const LINK_ENTITY_REPOSITORY_TOKEN = 'LinkEntity';

@Service(LINK_REPOSITORY_TOKEN)
export class LinkRepository implements ILinkRepository {
    constructor(
        @Inject(LINK_ENTITY_REPOSITORY_TOKEN)
        private readonly _linkRepository: Repository<LinkEntity>,
        @Inject()
        private _dataSource: DataSource,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    async create(linkEntity: LinkEntity): Promise<LinkEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_LINK: LinkEntity = await QUERY_RUNNER.manager.save(linkEntity);

        if (!SAVED_CREATED_LINK || !SAVED_CREATED_LINK?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_CREATED_LINK_WITH_NAME(linkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const CREATED_LINK_ENTITY: LinkEntity = await this.getById(SAVED_CREATED_LINK?.id);
        return CREATED_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    async createList(linkEntities: LinkEntity[]): Promise<LinkEntity[]> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        await QUERY_RUNNER.connect();
        await QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_LINK_LIST: LinkEntity[] = [];

        try {
            for (const LINK_ENTITY of linkEntities) {
                const SAVED_LINK_ENTITY: LinkEntity = await QUERY_RUNNER.manager.save(LINK_ENTITY);

                if (!SAVED_LINK_ENTITY || !SAVED_LINK_ENTITY?.id) {
                    await QUERY_RUNNER.rollbackTransaction();
                    throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_CREATED_LINK_WITH_NAME(LINK_ENTITY.name));
                }

                SAVED_CREATED_LINK_LIST.push(SAVED_LINK_ENTITY);
            }

            await QUERY_RUNNER.commitTransaction();
        } catch (error) {
            await QUERY_RUNNER.rollbackTransaction();
            throw error;
        } finally {
            await QUERY_RUNNER.release();
        }

        const CREATED_LINK_ENTITY_LIST: LinkEntity[] = await this.getByIdList(
            SAVED_CREATED_LINK_LIST.map((linkEntity: LinkEntity) => linkEntity.id)
        );
        return CREATED_LINK_ENTITY_LIST;
    }

    @LoggerMethodDecorator
    public async update(updateLinkEntity: LinkEntity): Promise<LinkEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();
        const UPDATED_LINK: UpdateResult = await QUERY_RUNNER.manager.update(LinkEntity, updateLinkEntity.id, updateLinkEntity);

        if (!UPDATED_LINK || !UPDATED_LINK?.affected) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_UPDATE_LINK(updateLinkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const UPDATED_LINK_ENTITY: LinkEntity = await this.getById(updateLinkEntity.id);
        return UPDATED_LINK_ENTITY;
    }

    public async getById(linkId: number): Promise<LinkEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY: LinkEntity | null = await this._linkRepository
            .createQueryBuilder('link')
            .leftJoinAndSelect('link.groupLink', 'groupLink')
            .where('link.id = :linkId', { linkId })
            .andWhere('link.userId = :userId', { userId: USER_ID })
            .getOne();

        if (!LINK_ENTITY || !LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async getByIdList(linkIdList: number[]): Promise<LinkEntity[]> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY_LIST: LinkEntity[] = await this._linkRepository.find({
            where: { id: In(linkIdList), userId: USER_ID },
        });

        if (!LINK_ENTITY_LIST || LINK_ENTITY_LIST.length === 0) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkIdList[0]));
        }

        return LINK_ENTITY_LIST;
    }

    @LoggerMethodDecorator
    public async getAll(): Promise<LinkEntity[]> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY_LIST: LinkEntity[] | null = await this._linkRepository.findBy({ userId: USER_ID });

        if (!LINK_ENTITY_LIST || !LINK_ENTITY_LIST.length) {
            return new Array<LinkEntity>();
        }

        return LINK_ENTITY_LIST;
    }

    @LoggerMethodDecorator
    public async getAllPaginated(paginateItem: IPaginateItem<ILink>): Promise<IPaginateItem<LinkEntity>> {
        const USER_ID = this._tokenService.getCurrentUserId();
        const LINK_COUNT = await this._linkRepository.count({ where: { userId: USER_ID } });

        const PAGINATE_DATA: IPaginateCalculateRequest = {
            totalCount: LINK_COUNT,
            startIndex: paginateItem.skip ?? PAGINATE_CONSTANT.DEFAULT_SKIP,
            take: paginateItem.take ?? PAGINATE_CONSTANT.DEFAULT_TAKE,
            currentPage: paginateItem?.currentPage ?? PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE,
        };

        const PAGINATE_INFO: IPaginateCalculateResult = PaginateCalculateHelper.calculate(PAGINATE_DATA);

        const LINK_ENTITY_LIST = await this._linkRepository.find({
            where: { userId: USER_ID },
            skip: PAGINATE_INFO.currentPageStartIndex,
            take: PAGINATE_INFO.currentPageTotal,
        });

        const RESULT: IPaginateItem<LinkEntity> = PaginateCalculateHelper.result(PAGINATE_INFO, LINK_ENTITY_LIST);
        return RESULT;
    }

    @LoggerMethodDecorator
    public async delete(linkId: number): Promise<boolean> {
        const DELETE_LINK_ENTITY: LinkEntity | null = await this.getById(linkId);

        if (!DELETE_LINK_ENTITY || !DELETE_LINK_ENTITY?.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const DELETED_LINK: DeleteResult = await QUERY_RUNNER.manager.delete(LinkEntity, DELETE_LINK_ENTITY?.id);

        if (!DELETED_LINK || !DELETED_LINK?.affected) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_DELETE_LINK(DELETE_LINK_ENTITY?.name ?? ''));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        return DELETED_LINK?.affected > 0;
    }

    @LoggerMethodDecorator
    public async deleteList(linkIdList: number[]): Promise<boolean[]> {
        const DELETE_RESULT_LIST: boolean[] = [];

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        try {
            for (const LINK_ID of linkIdList) {
                const DELETE_LINK_ENTITY: LinkEntity | null = await this.getById(LINK_ID);

                if (!DELETE_LINK_ENTITY || !DELETE_LINK_ENTITY?.id) {
                    throw new NotFoundError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(LINK_ID));
                }

                const DELETED_LINK: DeleteResult = await QUERY_RUNNER.manager.delete(LinkEntity, DELETE_LINK_ENTITY?.id);

                if (!DELETED_LINK || !DELETED_LINK?.affected) {
                    await QUERY_RUNNER.rollbackTransaction();
                    throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_DELETE_LINK(DELETE_LINK_ENTITY?.name ?? ''));
                }

                DELETE_RESULT_LIST.push(DELETED_LINK?.affected > 0);
            }

            await QUERY_RUNNER.commitTransaction();
            return DELETE_RESULT_LIST;
        } catch (error) {
            await QUERY_RUNNER.rollbackTransaction();
            throw error;
        } finally {
            await QUERY_RUNNER.release();
        }
    }

    @LoggerMethodDecorator
    public async getLinkListByLinkListId(linkIdList: number[]): Promise<LinkEntity[]> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY_LIST: LinkEntity[] =
            (await this._linkRepository.find({
                where: {
                    id: In(linkIdList),
                    userId: USER_ID,
                },
            })) ?? [];

        return LINK_ENTITY_LIST;
    }

    @LoggerMethodDecorator
    public async getNextDisplayOrder(userId?: number, groupLinkId?: number | null): Promise<number | null> {
        if (!userId) {
            return null;
        }

        if (!groupLinkId) {
            return this.getNextDisplayOrderOutGroup(userId);
        }

        const NEXT_DISPLAY_ORDER = this.getNextDisplayOrderOnGroup(userId, groupLinkId);
        return NEXT_DISPLAY_ORDER;
    }

    @LoggerMethodDecorator
    private async getNextDisplayOrderOnGroup(userId?: number, groupLinkId?: number): Promise<number | null> {
        if (!userId || !groupLinkId) {
            return null;
        }

        const MAX_DISPLAY_ORDER = await this._linkRepository
            .createQueryBuilder('link')
            .select('MAX(link.displayOrder)', 'maxDisplayOrder')
            .where('link.userId = :userId', { userId: userId })
            .where('link.groupLinkId = :groupLinkId', { groupLinkId: groupLinkId })
            .getRawOne();

        const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
        return NEXT_DISPLAY_ORDER;
    }

    @LoggerMethodDecorator
    private async getNextDisplayOrderOutGroup(userId?: number): Promise<number | null> {
        if (!userId) {
            return null;
        }

        const MAX_DISPLAY_ORDER = await this._linkRepository
            .createQueryBuilder('link')
            .select('MAX(link.displayOrder)', 'maxDisplayOrder')
            .where('link.userId = :userId', { userId: userId })
            .getRawOne();

        const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
        return NEXT_DISPLAY_ORDER;
    }
}
