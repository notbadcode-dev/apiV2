import { LinkGroupRelationEntity } from '@entity/link-group-relation.entity';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { TagEntity } from '@entity/tag.entity';
import { Service } from 'typedi';

@Service()
export class LinkGroupRelationEntityToLinkGroupMapper {
    public mapByLinkEntityId(linkEntityId: number, linkGroupRelationEntityList?: LinkGroupRelationEntity[]): LinkGroupEntity | null {
        if (!linkEntityId || !linkGroupRelationEntityList || !linkGroupRelationEntityList?.length) {
            new Array<TagEntity>();
        }

        const LINK_GROUP_RELATION_ENTITY_BY_ENTITY_ID: LinkGroupRelationEntity[] =
            linkGroupRelationEntityList?.filter(
                (linkGroupRelationEntity: LinkGroupRelationEntity) => linkGroupRelationEntity.link.id === linkEntityId
            ) ?? new Array<LinkGroupRelationEntity>();

        if (!LINK_GROUP_RELATION_ENTITY_BY_ENTITY_ID || !LINK_GROUP_RELATION_ENTITY_BY_ENTITY_ID?.length) {
            new Array<TagEntity>();
        }

        const LINK_GROUP_ENTITY_LIST: LinkGroupEntity[] = LINK_GROUP_RELATION_ENTITY_BY_ENTITY_ID.map(
            (linkGroupRelationEntity: LinkGroupRelationEntity) => linkGroupRelationEntity.group
        );

        return LINK_GROUP_ENTITY_LIST.at(0) ?? null;
    }
}
