import { ILinkGroup } from '@model/group/group-link.model';
import { IGroup } from '@model/group/group.model';

export interface IGroupLinkService {
    getGroupLink(groupLinkId: number): Promise<ILinkGroup | null>;

    createGroupLink(createGroupLink: IGroup): Promise<IGroup | null>;
}
