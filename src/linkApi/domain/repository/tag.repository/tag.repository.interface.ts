import { TagEntity } from '@entity/tag.entity';
import { IAutocompleteResult } from '@model/autocomplete/autocomplete-result.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';

export interface ITagRepository {
    create(tag: TagEntity): Promise<TagEntity>;

    getAutocompleteFiltered<T>(autocompleteSearchTag: IAutocompleteSearch<T>): Promise<IAutocompleteResult<T>[]>;

    delete(tagId: number): Promise<boolean>;
}
