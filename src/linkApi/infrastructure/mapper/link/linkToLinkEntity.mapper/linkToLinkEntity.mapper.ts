import { LINK_CONSTANT } from '@constant/link.constant copy';
import { LinkEntity } from '@entity/link.entity';
import { ILink } from '@model/link/link.model';
import { Service, Token } from 'typedi';
import { ILinkToLinkEntityMapper } from './linkToLinkEntity.mapper.interface';

export const LINK_TO_LINK_ENTITY_MAPPER = new Token<ILinkToLinkEntityMapper>('LinkToLinkEntityMapper');

@Service(LINK_TO_LINK_ENTITY_MAPPER)
export class LinkToLinkEntityMapper implements ILinkToLinkEntityMapper {
    public map(link: ILink): LinkEntity {
        const LINK_ENTITY = new LinkEntity();
        LINK_ENTITY.id = link?.id;
        LINK_ENTITY.name = link?.name;
        LINK_ENTITY.url = link?.url;
        LINK_ENTITY.favorite = link?.favorite ?? LINK_CONSTANT.DEFAULT_ACTIVE;
        LINK_ENTITY.active = link?.active ?? LINK_CONSTANT.DEFAULT_FAVORITE;
        LINK_ENTITY.displayOrder = link.displayOrder ?? null;

        return LINK_ENTITY;
    }
}
