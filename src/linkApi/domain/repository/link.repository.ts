import { InternalServerError } from 'routing-controllers';
import { ERROR_MESSAGE_LINK } from 'shared/constant/error-message/error-message-link.constant';
import { NotFountError } from 'shared/error/not-found.error';
import { LoggerMethodDecorator } from 'shared/service/decorator/logger-method.decorator';
import { Inject, Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { LinkEntity } from '../entity/link.entity';

@Service()
export class LinkRepository {
    constructor(
        @Inject(LinkEntity.name)
        private readonly _linkRepository: Repository<LinkEntity>,
        @Inject() private _dataSource: DataSource
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
    public async getById(linkId: number): Promise<LinkEntity> {
        const LINK: LinkEntity | null = await this._linkRepository.findOneBy({ id: linkId });

        if (!LINK || !LINK.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK;
    }
}
