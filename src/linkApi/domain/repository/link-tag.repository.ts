import { ERROR_MESSAGE_LINK_TAG } from '@constant/error-message/error-message-link-tag.constant';
import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { NotFountError } from '@error/not-found.error';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkTagEntity } from '../entity/link-tag.entity';

const LINK_TAG_ENTITY_REPOSITORY_TOKEN = LinkTagEntity.name;
const LINK_ENTITY_REPOSITORY_TOKEN = LinkEntity.name;

@Service()
export class LinkTagRepository {
    constructor(
        @Inject(LINK_TAG_ENTITY_REPOSITORY_TOKEN)
        private readonly _linkTagRepository: Repository<LinkTagEntity>,
        @Inject(LINK_ENTITY_REPOSITORY_TOKEN) private readonly _linkRepository: Repository<LinkEntity>
    ) {}

    @LoggerMethodDecorator
    public async getById(linkTagId: number): Promise<LinkTagEntity> {
        const LINK_GROUP_RELATION: LinkTagEntity | null = await this._linkTagRepository.findOneBy({
            id: linkTagId,
        });

        if (!LINK_GROUP_RELATION || !LINK_GROUP_RELATION.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK_TAG.LINK_TAG_WITH_ID_NOT_FOUND(linkTagId));
        }

        return LINK_GROUP_RELATION;
    }

    @LoggerMethodDecorator
    public async getListByLinkId(linkId: number): Promise<LinkTagEntity[]> {
        const LINK_ENTITY = await this._linkRepository.findOne({ where: { id: linkId }, relations: [LinkTagEntity.name] });

        if (!LINK_ENTITY || !LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK_ENTITY?.linkTagList ?? new Array<LinkTagEntity>();
    }
}
