import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { NotFountError } from '@error/not-found.error';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkGroupRelationEntity } from '../entity/link-group-relation.entity';

@Service()
export class LinkGroupRelationRepository {
    constructor(
        @Inject(LinkGroupRelationEntity.name) private readonly _linkGroupRelationRepository: Repository<LinkGroupRelationEntity>,
        @Inject(LinkEntity.name) private readonly _linkRepository: Repository<LinkEntity>
    ) {}

    @LoggerMethodDecorator
    public async getById(linkGroupRelationId: number): Promise<LinkGroupRelationEntity> {
        const LINK_GROUP_RELATION: LinkGroupRelationEntity | null = await this._linkGroupRelationRepository.findOneBy({
            id: linkGroupRelationId,
        });

        if (!LINK_GROUP_RELATION || !LINK_GROUP_RELATION.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(linkGroupRelationId));
        }

        return LINK_GROUP_RELATION;
    }

    @LoggerMethodDecorator
    public async getListByLinkId(linkId: number): Promise<LinkGroupRelationEntity[]> {
        const LINK_ENTITY = await this._linkRepository.findOne({ where: { id: linkId }, relations: [LinkGroupRelationEntity.name] });

        if (!LINK_ENTITY || !LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_LINK.LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return LINK_ENTITY?.linkGroupRelationList ?? new Array<LinkGroupRelationEntity>();
    }
}
