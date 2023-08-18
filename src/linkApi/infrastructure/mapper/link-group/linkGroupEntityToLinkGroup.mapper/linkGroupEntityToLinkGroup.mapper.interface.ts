import { GroupLinkEntity } from '@entity/group_link.entity';
import { ILinkGroup } from '@model/group/group-link.model';

export interface ILinkGroupEntityToLinkGroupMapper {
    map(linkGroupEntity?: GroupLinkEntity | null): ILinkGroup | null;
}
