import { ILinkGroup } from '@model/group/group-link.model';

export interface IGroupLinkService {
    getGroupLink(groupLinkId: number): Promise<ILinkGroup | null>;
}
