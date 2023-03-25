import { TagEntity } from 'linkApi/domain/entity/tag.entity';
import { Service } from 'typedi';
import { ITag } from '../../model/tag/tag.model';

@Service()
export class TagEntityToTagMapper {
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
