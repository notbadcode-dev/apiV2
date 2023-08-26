import { GroupLinkEntity } from '@entity/group_link.entity';
import { IGroupLink } from '@model/group/group-link.model';

export interface ILinkGroupEntityToGroupMapper {
    map(linkGroupEntity?: GroupLinkEntity | null): IGroupLink | null;
}
