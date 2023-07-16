import { LinkGroupRelationEntity } from '@entity/link-group-relation.entity';
import { LinkGroupEntity } from '@entity/link-group.entity';

export interface ILinkGroupRelationEntityToLinkGroupMapper {
    mapByLinkEntityId(linkEntityId: number, linkGroupRelationEntityList?: LinkGroupRelationEntity[]): LinkGroupEntity | null;
}
