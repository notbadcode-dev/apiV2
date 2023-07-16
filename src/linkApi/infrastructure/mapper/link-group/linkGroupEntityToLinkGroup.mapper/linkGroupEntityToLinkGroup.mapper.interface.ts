import { LinkGroupEntity } from '@entity/link-group.entity';
import { ILinkGroup } from '@model/group/group-link.model';

export interface ILinkGroupEntityToLinkGroupMapper {
    map(linkGroupEntity?: LinkGroupEntity | null): ILinkGroup | null;
}
