import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { PAGINATE_CONSTANT } from '@constant/paginate.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroupLink } from '@model/group/group-link.model';
import {
    IPaginateCalculateRequest,
    IPaginateCalculateResult,
    IPaginateItem,
    PaginateCalculateHelper,
} from '@model/pagination-item/pagination-item.model';
import { IGroupLinkRepository } from '@repository/group-link.repository/group-link.repository.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { NotFoundError } from 'routing-controllers';
import { Inject, Service, Token } from 'typedi';
import { DataSource, DeleteResult, QueryRunner, Repository } from 'typeorm';

export const GROUP_LINK_REPOSITORY_TOKEN = new Token<IGroupLinkRepository>('GroupLinkRepository');
export const LINK_GROUP_ENTITY = 'GroupLinkEntity';

@Service(GROUP_LINK_REPOSITORY_TOKEN)
export class GroupLinkRepository implements IGroupLinkRepository {
    constructor(
        @Inject(LINK_GROUP_ENTITY)
        private readonly _linkGroupRepository: Repository<GroupLinkEntity>,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject()
        private _dataSource: DataSource
    ) {}

    @LoggerMethodDecorator
    public async create(groupLinkEntity: GroupLinkEntity): Promise<GroupLinkEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_GROUP_LINK: GroupLinkEntity = await QUERY_RUNNER.manager.save(groupLinkEntity);

        if (!SAVED_CREATED_GROUP_LINK || !SAVED_CREATED_GROUP_LINK?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_GROUP_LINK.COULD_NOT_CREATED_GROUP_LINK_WITH_NAME(groupLinkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const CREATED_GROUP_LINK_ENTITY: GroupLinkEntity = await this.getById(SAVED_CREATED_GROUP_LINK?.id);
        return CREATED_GROUP_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async update(updateGroupLinkEntity: GroupLinkEntity): Promise<GroupLinkEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();
        const UPDATED_GROUP_LINK: GroupLinkEntity = await QUERY_RUNNER.manager.save(updateGroupLinkEntity);

        if (!UPDATED_GROUP_LINK) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_GROUP_LINK.COULD_NOT_UPDATE_GROUP_LINK(updateGroupLinkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const UPDATED_GROUP_LINK_ENTITY: GroupLinkEntity = await this.getById(updateGroupLinkEntity.id);
        return UPDATED_GROUP_LINK_ENTITY;
    }

    public async associateLinkListToGroup(groupLinkId: number): Promise<boolean> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const GROUP_LINK_ENTITY: GroupLinkEntity | null = await this._linkGroupRepository.findOneBy({ id: groupLinkId, userId: USER_ID });

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(groupLinkId));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const SAVED_GROUP: GroupLinkEntity = await this.getById(GROUP_LINK_ENTITY.id);
        return !!SAVED_GROUP;
    }

    @LoggerMethodDecorator
    public async getById(groupLinkId: number): Promise<GroupLinkEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const GROUP_LINK_ENTITY: GroupLinkEntity | null = await this._linkGroupRepository.findOne({
            where: { id: groupLinkId, userId: USER_ID },
            relations: ['linkList'],
        });

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY?.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(groupLinkId));
        }

        return GROUP_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async getAll(): Promise<GroupLinkEntity[]> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const GROUP_LINK_ENTITY_LIST: GroupLinkEntity[] | null = await this._linkGroupRepository.find({
            where: { userId: USER_ID },
            relations: ['linkList'],
        });

        if (!GROUP_LINK_ENTITY_LIST || !GROUP_LINK_ENTITY_LIST.length) {
            return new Array<GroupLinkEntity>();
        }

        return GROUP_LINK_ENTITY_LIST;
    }

    @LoggerMethodDecorator
    public async getAllPaginated(paginateItem: IPaginateItem<IGroupLink>): Promise<IPaginateItem<GroupLinkEntity>> {
        const USER_ID = this._tokenService.getCurrentUserId();
        const GROUP_LINK_COUNT = await this._linkGroupRepository.count({ where: { userId: USER_ID } });

        const PAGINATE_DATA: IPaginateCalculateRequest = {
            totalCount: GROUP_LINK_COUNT,
            startIndex: paginateItem.skip ?? PAGINATE_CONSTANT.DEFAULT_SKIP,
            take: paginateItem.take ?? PAGINATE_CONSTANT.DEFAULT_TAKE,
            currentPage: paginateItem?.currentPage ?? PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE,
        };

        const PAGINATE_INFO: IPaginateCalculateResult = PaginateCalculateHelper.calculate(PAGINATE_DATA);

        const GROUP_LINK_ENTITY_LIST = await this._linkGroupRepository.find({
            where: { userId: USER_ID },
            skip: PAGINATE_INFO.currentPageStartIndex,
            take: PAGINATE_INFO.currentPageTotal,
        });

        const RESULT: IPaginateItem<GroupLinkEntity> = PaginateCalculateHelper.result(PAGINATE_INFO, GROUP_LINK_ENTITY_LIST);
        return RESULT;
    }

    @LoggerMethodDecorator
    public async delete(deleteGroupLink: IDeleteGroup): Promise<boolean> {
        const DELETE_GROUP_LINK_ENTITY: GroupLinkEntity | null = await this.getById(deleteGroupLink.id);

        if (!DELETE_GROUP_LINK_ENTITY || !DELETE_GROUP_LINK_ENTITY?.id) {
            throw new NotFoundError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(deleteGroupLink.id));
        }

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        try {
            for (const LINK_ENTITY of DELETE_GROUP_LINK_ENTITY.linkList || []) {
                LINK_ENTITY.groupLink = null;
                await QUERY_RUNNER.manager.save(LinkEntity, LINK_ENTITY);
            }

            const DELETED_LINK: DeleteResult = await QUERY_RUNNER.manager.delete(GroupLinkEntity, DELETE_GROUP_LINK_ENTITY?.id);

            if (!DELETED_LINK || !DELETED_LINK?.affected) {
                await QUERY_RUNNER.rollbackTransaction();
                throw new InternalServerError(ERROR_MESSAGE_GROUP_LINK.COULD_NOT_DELETE_GROUP_LINK(DELETE_GROUP_LINK_ENTITY?.name ?? ''));
            }

            await QUERY_RUNNER.commitTransaction();
            return DELETED_LINK?.affected > 0;
        } catch (error) {
            await QUERY_RUNNER.rollbackTransaction();
            throw error;
        } finally {
            await QUERY_RUNNER.release();
        }
    }

    @LoggerMethodDecorator
    public async getNextDisplayOrder(userId?: number): Promise<number | null> {
        if (!userId) {
            return null;
        }

        const MAX_DISPLAY_ORDER = await await this._linkGroupRepository
            .createQueryBuilder('group_link')
            .select('MAX(group_link.display_order)', 'maxDisplayOrder')
            .where('group_link.userId = :userId', { userId: userId })
            .getRawOne();

        const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
        return NEXT_DISPLAY_ORDER;
    }
}
