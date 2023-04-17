import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { NotFountError } from '@error/not-found.error';
import { LinkToLinkEntityMapper } from '@mapper/link/linkToLinkEntity.mapper';
import { ILink } from '@model/link/link.model';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
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
        @Inject() private _linkToLinkEntityMapper: LinkToLinkEntityMapper
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

        const LINK_CREATED = await this.getById(SAVED_CREATED_LINK?.id);
        return LINK_CREATED;
    }

    @LoggerMethodDecorator
    public async update(link: ILink): Promise<LinkEntity> {
        const LINK_ENTITY = await this._linkToLinkEntityMapper.map(link);

        const queryRunner = this._dataSource.createQueryRunner();
        queryRunner.connect();
        queryRunner.startTransaction();

        const UPDATED_USER = await queryRunner.manager.update(LinkEntity, link.id, LINK_ENTITY);

        if (!UPDATED_USER || !UPDATED_USER?.affected) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_UPDATE_LINK(link.name));
        }

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return await this.getById(link.id);
    }

    @LoggerMethodDecorator
    public async getById(linkId: number): Promise<LinkEntity> {
        const LINK: LinkEntity | null = await this._linkRepository.findOneBy({ id: linkId });

        if (!LINK || !LINK.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK;
    }
}
