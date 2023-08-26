import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroupLink } from '@model/group/group-link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGroupLinkService {
    createGroupLink(createGroupLink: IGroupLink): Promise<IGroupLink | null>;

    updateGroupLink(updateGroupLinkId: number, updateGroupLink: IGroupLink): Promise<IGroupLink | null>;

    getGroupLink(groupLinkId: number): Promise<IGroupLink | null>;

    getGroupLinkList(): Promise<(IGroupLink | null)[]>;

    getPaginateGroupLinkList(paginateGroupLinkList: IPaginateItem<IGroupLink>): Promise<IPaginateItem<IGroupLink | null>>;

    deleteGroupLink(deleteGroupLink: IDeleteGroup): Promise<boolean>;
}
