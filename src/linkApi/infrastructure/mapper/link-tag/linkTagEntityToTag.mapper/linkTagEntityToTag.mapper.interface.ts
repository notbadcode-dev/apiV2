import { LinkTagEntity } from '@entity/link-tag.entity';
import { TagEntity } from '@entity/tag.entity';

export interface ILinkTagEntityToTagMapper {
    mapByLinkEntityId(linkEntityId: number, linkTagEntityList?: LinkTagEntity[]): TagEntity[];
}
