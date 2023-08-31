import { IAutocompleteResult } from '@model/autocomplete/autocomplete-result.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';

export interface ITagService {
    createTag(createTag: ITagCreate): Promise<ITag>;

    deleteTag(deleteTagId: number): Promise<boolean>;

    getAutocomplete(tagAutocompleteSearch: IAutocompleteSearch): Promise<IAutocompleteResult<ITag>>;
}
