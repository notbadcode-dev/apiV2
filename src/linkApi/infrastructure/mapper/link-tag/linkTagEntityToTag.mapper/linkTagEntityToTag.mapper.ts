import { LinkTagEntity } from '@entity/link-tag.entity';
import { TagEntity } from '@entity/tag.entity';
import { Service, Token } from 'typedi';
import { ILinkTagEntityToTagMapper } from './linkTagEntityToTag.mapper.interface';

export const LINK_TAG_ENTITY_TO_TAG = new Token<ILinkTagEntityToTagMapper>('LinkTagEntityToTagMapper');

@Service(LINK_TAG_ENTITY_TO_TAG)
export class LinkTagEntityToTagMapper implements ILinkTagEntityToTagMapper {
    public mapByLinkEntityId(linkEntityId: number, linkTagEntityList?: LinkTagEntity[]): TagEntity[] {
        if (!linkEntityId || !linkTagEntityList || !linkTagEntityList?.length) {
            new Array<TagEntity>();
        }

        const LINK_TAG_ENTITY_LIST_BY_LINK_ENTITY_ID: LinkTagEntity[] =
            linkTagEntityList?.filter((linkTagEntity: LinkTagEntity) => linkTagEntity.link.id === linkEntityId) ??
            new Array<LinkTagEntity>();

        if (!LINK_TAG_ENTITY_LIST_BY_LINK_ENTITY_ID || !LINK_TAG_ENTITY_LIST_BY_LINK_ENTITY_ID?.length) {
            new Array<TagEntity>();
        }

        return LINK_TAG_ENTITY_LIST_BY_LINK_ENTITY_ID.map((linkTagEntity: LinkTagEntity) => linkTagEntity.tag);
    }
}
