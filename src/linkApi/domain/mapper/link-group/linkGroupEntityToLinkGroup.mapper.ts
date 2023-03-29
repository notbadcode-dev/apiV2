import { ILinkGroup } from '@model/group/group-link.model';
import { LinkGroupEntity } from 'linkApi/domain/entity/link-group.entity';
import { Service } from 'typedi';

@Service()
export class LinkGroupEntityToLinkGroupMapper {
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
