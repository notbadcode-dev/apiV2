import { TagEntity } from '@entity/tag.entity';
import { ITag } from '@model/tag/tag.model';

export interface ITagEntityToTagMapper {
    map(tagEntity: TagEntity): ITag;

    mapToList(tagEntityList?: TagEntity[]): ITag[];
}
