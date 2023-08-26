import { TGroupLinkGradientType } from '@enum/group-link-gradient-type.enum';
import { ILink } from '@model/link/link.model';
import { ITag } from '@model/tag/tag.model';

export interface IGroup {
    id: number;
    name: string;
    linkList: ILink[];
    tagList?: ITag[];
    colorFrom?: string;
    colorTo?: string;
    gradientType?: TGroupLinkGradientType;
    displayOrder?: number | null;
}
