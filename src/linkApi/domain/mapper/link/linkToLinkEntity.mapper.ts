import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';
import { Service } from 'typedi';

@Service()
export class LinkToLinkEntityMapper {
    public async map(link: ILink): Promise<LinkEntity> {
        const linkEntity = {
            ...new LinkEntity(),
            id: link?.id,
            name: link?.name,
            url: link?.url,
        };

        return linkEntity;
    }
}
