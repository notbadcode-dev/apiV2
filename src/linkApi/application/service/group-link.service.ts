import { IGroupLinkService } from '@interface/group-link.service.interface';
import { LinkGroupRelationRepository } from '@repository/link-group-relation.repository';
import { Inject, Token } from 'typedi';

export const GROUP_LINK_SERVICE_TOKEN = new Token<IGroupLinkService>('GroupLinkService');

export class GroupLinkService implements IGroupLinkService {
    constructor(@Inject() private _groupLinkRepository: LinkGroupRelationRepository) {}
}
