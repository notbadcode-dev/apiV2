import { LinkGroupEntity } from '@entity/link-group.entity';
import { IGroup } from '@model/group/group.model';

export interface ILinkGroupEntityToGroupMapper {
    map(linkGroupEntity?: LinkGroupEntity | null): IGroup | null;
}
