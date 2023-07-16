import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';

export interface ILinkToLinkEntityMapper {
    map(link: ILink): Promise<LinkEntity>;
}
