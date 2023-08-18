import { GroupLinkEntity } from '@entity/group_link.entity';
import { IGroup } from '@model/group/group.model';

export interface ILinkGroupEntityToGroupMapper {
    map(linkGroupEntity?: GroupLinkEntity | null): IGroup | null;
}
