import { LinkGroupRelationRepository } from '@repository/link-group-relation.repository';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { Inject, Token } from 'typedi';

export const GROUP_LINK_SERVICE_TOKEN = new Token<IGroupLinkService>('GroupLinkService');

export class GroupLinkService implements IGroupLinkService {
    constructor(@Inject() private _groupLinkRepository: LinkGroupRelationRepository) {}
}
