import { TGroupLinkGradientType } from '@enum/group-link-gradient-type.enum';
import { ILinkGroup } from '@model/group/group-link.model';
import { ILink } from '@model/link/link.model';
import { ITag } from '@model/tag/tag.model';

export interface IGroup extends ILinkGroup {
    linkList: ILink[];
    tagList?: ITag[];
    colorFrom?: string;
    colorTo?: string;
    gradientType?: TGroupLinkGradientType;
    displayOrder?: number | null;
}
