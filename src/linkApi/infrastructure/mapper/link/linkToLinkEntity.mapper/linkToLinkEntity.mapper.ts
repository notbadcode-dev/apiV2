import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';
import { Service, Token } from 'typedi';
import { ILinkToLinkEntityMapper } from '../linkEntityToLink.mapper/linkEntityToLink.mapper.interface';

export const LINK_TO_LINK_ENTITY_MAPPER = new Token<ILinkToLinkEntityMapper>('LinkToLinkEntityMapper');

@Service(LINK_TO_LINK_ENTITY_MAPPER)
export class LinkToLinkEntityMapper implements ILinkToLinkEntityMapper {
    public async map(link: ILink): Promise<LinkEntity> {
        const LINK_ENTITY = {
            ...new LinkEntity(),
            id: link?.id,
            name: link?.name,
            url: link?.url,
            favorite: link?.favorite ?? false,
            active: link?.active ?? true,
        };

        return LINK_ENTITY;
    }
}
