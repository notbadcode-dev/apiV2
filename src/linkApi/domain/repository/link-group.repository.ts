import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { LinkGroupRelationEntity } from '../entity/link-group-relation.entity';

@Service()
export class GroupLinkRepository {
    constructor(
        @Inject(LinkGroupRelationEntity.name)
        private readonly _linkGroupRepository: Repository<LinkGroupRelationEntity>
    ) {}
}
