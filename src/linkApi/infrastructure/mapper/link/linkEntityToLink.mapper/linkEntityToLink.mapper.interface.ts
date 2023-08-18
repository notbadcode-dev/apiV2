import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';

export interface ILinkEntityToLinkMapper {
    map(linkEntity: LinkEntity): ILink;
}
