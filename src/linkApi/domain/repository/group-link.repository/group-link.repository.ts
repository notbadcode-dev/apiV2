import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { LinkGroupRelationEntity } from '@entity/link-group-relation.entity';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { LinkEntity } from '@entity/link.entity';
import { InternalServerError } from '@error/internal-server.error';
import { NotFountError } from '@error/not-found.error';
import { LinkRepository, LINK_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { IGroupLinkRepository } from './group-link.repository.interface';

const LINK_GROUP_ENTITY = LinkGroupEntity.name;
const LINK_GROUP_RELATION_ENTITY = LinkGroupRelationEntity.name;
export const GROUP_LINK_REPOSITORY_TOKEN = new Token<IGroupLinkRepository>('GroupLinkRepository');

@Service(GROUP_LINK_REPOSITORY_TOKEN)
export class GroupLinkRepository implements IGroupLinkRepository {
    constructor(
        @Inject(LINK_GROUP_ENTITY)
        private readonly _linkGroupRepository: Repository<LinkGroupEntity>,
        @Inject(LINK_GROUP_RELATION_ENTITY)
        private readonly _linkGroupRelationRepository: Repository<LinkGroupRelationEntity>,
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject()
        private _dataSource: DataSource
    ) {}

    @LoggerMethodDecorator
    async create(groupLinkEntity: LinkGroupEntity): Promise<LinkGroupEntity> {
        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        const NEW_GROUP_LINK = new LinkGroupEntity();
        NEW_GROUP_LINK.name = groupLinkEntity.name;
        NEW_GROUP_LINK.userId = groupLinkEntity.userId;
        NEW_GROUP_LINK.linkGroupList = [];

        const SAVED_CREATED_GROUP_LINK: LinkGroupEntity = await QUERY_RUNNER.manager.save(NEW_GROUP_LINK);

        if (!SAVED_CREATED_GROUP_LINK || !SAVED_CREATED_GROUP_LINK?.id) {
            await QUERY_RUNNER.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_GROUP_LINK.COULD_NOT_CREATED_LINK_WITH_NAME(groupLinkEntity.name));
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const CREATED_GROUP_LINK_ENTITY: LinkGroupEntity = await this.getById(SAVED_CREATED_GROUP_LINK?.id);
        return CREATED_GROUP_LINK_ENTITY;
    }

    async associateLinkListToGroup(groupLinkId: number, entityLinkIdList: number[], firstLinkOrder?: number): Promise<boolean> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY_LIST: LinkEntity[] = await this._linkRepository.getLinkListByLinkListId(entityLinkIdList);
        const GROUP_LINK_ENTITY: LinkGroupEntity | null = await this._linkGroupRepository.findOneBy({ id: groupLinkId, userId: USER_ID });

        const QUERY_RUNNER: QueryRunner = this._dataSource.createQueryRunner();
        QUERY_RUNNER.connect();
        QUERY_RUNNER.startTransaction();

        let order = firstLinkOrder;

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(groupLinkId));
        }

        if (!order) {
            const HIGHEST_ORDER_INDEX_RELATION = await this._linkGroupRelationRepository.findOne({
                where: {
                    group: {
                        id: groupLinkId,
                    },
                },
                order: { order_index: 'DESC' },
            });

            order = HIGHEST_ORDER_INDEX_RELATION?.order_index || 0;
        }

        for (const LINK_ENTITY of LINK_ENTITY_LIST) {
            GROUP_LINK_ENTITY.linkGroupList?.push({
                id: 0,
                group: GROUP_LINK_ENTITY,
                link: LINK_ENTITY,
                order_index: order,
                userId: USER_ID,
            });
        }

        await QUERY_RUNNER.commitTransaction();
        await QUERY_RUNNER.release();

        const SAVED_GROUP: LinkGroupEntity = await this.getById(GROUP_LINK_ENTITY.id);
        return !!SAVED_GROUP;
    }

    @LoggerMethodDecorator
    public async getById(groupLinkId: number): Promise<LinkGroupEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const GROUP_LINK_ENTITY: LinkGroupEntity | null = await this._linkGroupRepository.findOne({
            where: { id: groupLinkId, userId: USER_ID },
            relations: [LinkGroupRelationEntity.name],
        });
        // .findOneBy({ id: groupLinkId, userId: USER_ID });

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(groupLinkId));
        }

        return GROUP_LINK_ENTITY;
    }
}
