import { TagEntity } from '@entity/tag.entity';
import { ITagEntityToTagMapper } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper.interface';
import { ITag } from '@model/tag/tag.model';
import { Service, Token } from 'typedi';

export const TAG_ENTITY_TO_TAG_MAPPER = new Token<ITagEntityToTagMapper>('TagEntityToTagMapper');

@Service(TAG_ENTITY_TO_TAG_MAPPER)
export class TagEntityToTagMapper implements ITagEntityToTagMapper {
    public map(tagEntity: TagEntity): ITag {
        const TAG: ITag = {
            id: tagEntity.id,
            name: tagEntity.name,
        };

        return TAG;
    }

    public mapToList(tagEntityList?: TagEntity[]): ITag[] {
        if (!tagEntityList) {
            return new Array<ITag>();
        }

        const TAG_LIST: ITag[] = tagEntityList.map((tagEntity: TagEntity) => this.map(tagEntity));
        return TAG_LIST;
    }
}
