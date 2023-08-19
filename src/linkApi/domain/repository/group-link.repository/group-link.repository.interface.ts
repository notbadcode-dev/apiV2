import { GroupLinkEntity } from '@entity/group_link.entity';
import { IGroup } from '@model/group/group.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGroupLinkRepository {
    create(link: GroupLinkEntity): Promise<GroupLinkEntity>;

    associateLinkListToGroup(groupLinkId: number): Promise<boolean>;

    getById(groupLinkId: number): Promise<GroupLinkEntity>;

    getAll(): Promise<GroupLinkEntity[]>;

    getAllPaginated(paginateItem: IPaginateItem<IGroup>): Promise<IPaginateItem<GroupLinkEntity>>;

    getNextDisplayOrder(userId?: number): Promise<number | null>;
}
