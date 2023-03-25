import { ERROR_MESSAGE_GROUP_LINK } from 'shared/constant/error-message/error-message-group-link.constant';
import { NotFountError } from 'shared/error/not-found.error';
import { LoggerMethodDecorator } from 'shared/service/decorator/logger-method.decorator';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkGroupRelationEntity } from '../entity/link-group-relation.entity';

@Service()
export class LinkGroupRelationRepository {
    constructor(private readonly _linkGroupRelationRepository: Repository<LinkGroupRelationEntity>) {}

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
}
