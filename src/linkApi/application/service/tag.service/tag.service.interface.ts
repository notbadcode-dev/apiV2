import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';

export interface ITagService {
    createTag(createTag: ITagCreate): Promise<ITag>;
}
