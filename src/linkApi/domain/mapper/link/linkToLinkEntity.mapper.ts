import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';
import { Service } from 'typedi';

@Service()
export class LinkToLinkEntityMapper {
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
