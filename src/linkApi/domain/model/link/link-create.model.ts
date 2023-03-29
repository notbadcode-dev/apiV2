import { ICommonLink } from './link-common.model';

export interface ILinkCreate extends ICommonLink {
    groupLinkId?: number;
    tagIdList?: number[];
}
