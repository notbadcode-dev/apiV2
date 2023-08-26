import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroup } from '@model/group/group.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGroupLinkService {
    createGroupLink(createGroupLink: IGroup): Promise<IGroup | null>;

    updateGroupLink(updateGroupLinkId: number, updateGroupLink: IGroup): Promise<IGroup | null>;

    getGroupLink(groupLinkId: number): Promise<IGroup | null>;

    getGroupLinkList(): Promise<(IGroup | null)[]>;

    getPaginateGroupLinkList(paginateGroupLinkList: IPaginateItem<IGroup>): Promise<IPaginateItem<IGroup | null>>;

    deleteGroupLink(deleteGroupLink: IDeleteGroup): Promise<boolean>;
}
