import { LinkGroupRelationRepository } from 'linkApi/domain/repository/link-group-relation.repository';
import { Inject } from 'typedi';

export class GroupLinkService {
    constructor(@Inject() private _groupLinkRepository: LinkGroupRelationRepository) {}
}
