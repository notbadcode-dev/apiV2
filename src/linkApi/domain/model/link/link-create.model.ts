import { ICommonLink } from '@model/link/link-common.model';

export interface ILinkCreate extends ICommonLink {
    groupLinkId?: number;
    tagIdList?: number[];
}
