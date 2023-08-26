import { IGroupLink } from '@model/group/group-link.model';
import { ICommonLink } from '@model/link/link-common.model';
import { ITag } from '@model/tag/tag.model';

export interface ILink extends ICommonLink {
    id: number;
    displayOrder?: number | null;
    tagList?: ITag[];
    linkGroupId?: number | null;
    linkGroup?: IGroupLink | null;
}
