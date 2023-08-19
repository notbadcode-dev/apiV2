import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { PAGINATE } from '@constant/paginate.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import { IGroup } from '@model/group/group.model';
import {
    IPaginateCalculateRequest,
    IPaginateCalculateResult,
    IPaginateItem,
    PaginateCalculateHelper,
} from '@model/pagination-item/pagination-item.model';
import { LinkRepository, LINK_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { IGroupLinkRepository } from './group-link.repository.interface';

export const GROUP_LINK_REPOSITORY_TOKEN = new Token<IGroupLinkRepository>('GroupLinkRepository');
export const LINK_GROUP_ENTITY = 'GroupLinkEntity';

@Service(GROUP_LINK_REPOSITORY_TOKEN)
export class GroupLinkRepository implements IGroupLinkRepository {
    constructor(
        @Inject(LINK_GROUP_ENTITY)
        private readonly _linkGroupRepository: Repository<GroupLinkEntity>,
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject()
        private _dataSource: DataSource
    ) {}

    @LoggerMethodDecorator
    async create(groupLinkEntity: GroupLinkEntity): Promise<GroupLinkEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const SAVED_CREATED_GROUP_LINK: GroupLinkEntity = await QUERY_RUNNER.manager.save(groupLinkEntity);

        if (!SAVED_CREATED_GROUP_LINK || !SAVED_CREATED_GROUP_LINK?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_GROUP_LINK.COULD_NOT_CREATED_LINK_WITH_NAME(groupLinkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const CREATED_GROUP_LINK_ENTITY: GroupLinkEntity = await this.getById(SAVED_CREATED_GROUP_LINK?.id);
        return CREATED_GROUP_LINK_ENTITY;
    }

    async associateLinkListToGroup(groupLinkId: number): Promise<boolean> {
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

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY.id) {
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
    public async getAllPaginated(paginateItem: IPaginateItem<IGroup>): Promise<IPaginateItem<GroupLinkEntity>> {
        const USER_ID = this._tokenService.getCurrentUserId();
        const GROUP_LINK_COUNT = await this._linkGroupRepository.count({ where: { userId: USER_ID } });

        const PAGINATE_DATA: IPaginateCalculateRequest = {
            totalCount: GROUP_LINK_COUNT,
            startIndex: paginateItem.skip ?? PAGINATE.DEFAULT_SKIP,
            take: paginateItem.take ?? PAGINATE.DEFAULT_TAKE,
            currentPage: paginateItem?.currentPage ?? PAGINATE.DEFAULT_CURRENT_PAGE,
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
}
