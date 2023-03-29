import { GroupLinkGradientType } from '../../shared/enum/group-link-gradient-type.enum';
import { ILink } from '../link/link.model';
import { ITag } from '../tag/tag.model';
import { ILinkGroup } from './group-link.model';

export interface IGroup extends ILinkGroup {
    linkList: ILink[];
    tagList: ITag[];
    colorFrom: string;
    colorTo: string;
    gradientType: GroupLinkGradientType;
}
