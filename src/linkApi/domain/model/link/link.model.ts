import { ILinkGroup } from '../group/group-link.model';
import { ITag } from '../tag/tag.model';
import { ICommonLink } from './link-common.model';

export interface ILink extends ICommonLink {
    id: number;
    order?: number | null;
    tagList?: ITag[];
    linkGroupId?: number | null;
    linkGroup?: ILinkGroup | null;
}
