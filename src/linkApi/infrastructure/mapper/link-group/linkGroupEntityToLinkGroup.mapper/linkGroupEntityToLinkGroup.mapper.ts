import { LinkGroupEntity } from '@entity/link-group.entity';
import { ILinkGroup } from '@model/group/group-link.model';
import { Service, Token } from 'typedi';
import { ILinkGroupEntityToLinkGroupMapper } from './linkGroupEntityToLinkGroup.mapper.interface';

export const LINK_GROUP_ENTITY_TO_GROUP_MAPPER = new Token<ILinkGroupEntityToLinkGroupMapper>('LinkGroupEntityToLinkGroupMapper');

@Service(LINK_GROUP_ENTITY_TO_GROUP_MAPPER)
export class LinkGroupEntityToLinkGroupMapper implements ILinkGroupEntityToLinkGroupMapper {
    public map(linkGroupEntity?: LinkGroupEntity | null): ILinkGroup | null {
        if (!linkGroupEntity || !linkGroupEntity.id || !linkGroupEntity.name) {
            return null;
        }

        const LINK_GROUP: ILinkGroup = {
            id: linkGroupEntity.id,
            name: linkGroupEntity.name,
        };

        return LINK_GROUP;
    }
}
