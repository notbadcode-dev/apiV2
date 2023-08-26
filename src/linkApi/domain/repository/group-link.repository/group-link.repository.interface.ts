import { GroupLinkEntity } from '@entity/group_link.entity';
import { IGroupLink } from '@model/group/group-link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGroupLinkRepository {
    create(link: GroupLinkEntity): Promise<GroupLinkEntity>;

    associateLinkListToGroup(groupLinkId: number): Promise<boolean>;

    getById(groupLinkId: number): Promise<GroupLinkEntity>;

    getAll(): Promise<GroupLinkEntity[]>;

    getAllPaginated(paginateItem: IPaginateItem<IGroupLink>): Promise<IPaginateItem<GroupLinkEntity>>;

    getNextDisplayOrder(userId?: number): Promise<number | null>;
}
