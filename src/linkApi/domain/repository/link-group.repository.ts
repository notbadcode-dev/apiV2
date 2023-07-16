import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkGroupRelationEntity } from '../entity/link-group-relation.entity';

const LINK_GROUP_RELATION_ENTITY_REPOSITORY_TOKEN = LinkGroupRelationEntity.name;

@Service()
export class GroupLinkRepository {
    constructor(
        @Inject(LINK_GROUP_RELATION_ENTITY_REPOSITORY_TOKEN)
        private readonly _linkGroupRepository: Repository<LinkGroupRelationEntity>
    ) {}
}
