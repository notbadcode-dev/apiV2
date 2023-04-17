import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { PAGINATE } from '@constant/paginate.constant';
import { NotFountError } from '@error/not-found.error';
import { LinkToLinkEntityMapper } from '@mapper/link/linkToLinkEntity.mapper';
import { ILink } from '@model/link/link.model';
import {
    IPaginateCalculateRequest,
    IPaginateCalculateResult,
    IPaginateItem,
    PaginateCalculateHelper,
} from '@model/pagination-item/pagination-item.model';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService } from '@service/token.service';
import { InternalServerError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { LinkEntity } from '../entity/link.entity';

@Service()
export class LinkRepository {
    constructor(
        @Inject(LinkEntity.name)
        private readonly _linkRepository: Repository<LinkEntity>,
        @Inject() private _dataSource: DataSource,
        @Inject() private _linkToLinkEntityMapper: LinkToLinkEntityMapper,
        @Inject() private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    async create(link: LinkEntity): Promise<LinkEntity> {
        const NEW_LINK = new LinkEntity();
        NEW_LINK.name = link.name;
        NEW_LINK.url = link.url;
        NEW_LINK.favorite = link.favorite;
        NEW_LINK.active = link.active;
        NEW_LINK.userId = link.userId;

        const queryRunner = this._dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        const SAVED_CREATED_LINK = await queryRunner.manager.save(NEW_LINK);

        if (!SAVED_CREATED_LINK || !SAVED_CREATED_LINK?.id) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_CREATED_LINK_WITH_NAME(link.name));
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const CREATED_LINK_ENTITY = await this.getById(SAVED_CREATED_LINK?.id);
        return CREATED_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async update(link: ILink): Promise<LinkEntity> {
        const UPDATE_LINK_ENTITY = await this._linkToLinkEntityMapper.map(link);

        const queryRunner = this._dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        const UPDATED_USER = await queryRunner.manager.update(LinkEntity, link.id, UPDATE_LINK_ENTITY);

        if (!UPDATED_USER || !UPDATED_USER?.affected) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_UPDATE_LINK(link.name));
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const UPDATED_LINK_ENTITY: LinkEntity = await this.getById(link.id);
        return UPDATED_LINK_ENTITY;
    }

    @LoggerMethodDecorator
    public async getById(linkId: number): Promise<LinkEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY: LinkEntity | null = await this._linkRepository.findOneBy({ id: linkId, userId: USER_ID });

        if (!LINK_ENTITY || !LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK_ENTITY;
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
            startIndex: paginateItem.skip ?? PAGINATE.DEFAULT_SKIP,
            take: paginateItem.take ?? PAGINATE.DEFAULT_TAKE,
            currentPage: paginateItem?.currentPage ?? PAGINATE.DEFAULT_CURRENT_PAGE,
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
}
