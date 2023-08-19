import { IDeleteGroup } from '@model/group/delete-group.model';
import { ILinkGroup } from '@model/group/group-link.model';
import { IGroup } from '@model/group/group.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGroupLinkService {
    createGroupLink(createGroupLink: IGroup): Promise<IGroup | null>;

    updateGroupLink(updateGroupLinkId: number, updateGroupLink: IGroup): Promise<IGroup | null>;

    getGroupLink(groupLinkId: number): Promise<ILinkGroup | null>;

    getGroupLinkList(): Promise<(IGroup | null)[]>;

    getPaginateGroupLinkList(paginateGroupLinkList: IPaginateItem<IGroup>): Promise<IPaginateItem<IGroup | null>>;

    deleteGroupLink(deleteGroupLink: IDeleteGroup): Promise<boolean>;
}
