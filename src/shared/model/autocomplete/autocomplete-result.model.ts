import { IAutocompleteCommon } from '@model/autocomplete/autocomplete-common.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';

export interface IAutocompleteResult<T> extends IAutocompleteCommon {
    search?: string;
    itemList: T[];
    lastUsedItemList: T[];
}

export class IAutocompleteResultHelper {
    static mapFromAutocompleteSearch<T>(
        autocompleteSearch: IAutocompleteSearch,
        itemList: T[],
        lastUsedItemList?: T[]
    ): IAutocompleteResult<T> {
        const AUTOCOMPLETE_RESULT: IAutocompleteResult<T> = {
            search: autocompleteSearch.search,
            itemList: itemList,
            lastUsedItemList: lastUsedItemList ?? new Array<T>(),
        };

        if (autocompleteSearch?.returnExcludedList ?? false) {
            AUTOCOMPLETE_RESULT.excludedItemIdList = autocompleteSearch.excludedItemIdList;
            AUTOCOMPLETE_RESULT.excludedItemContainTextList = autocompleteSearch.excludedItemContainTextList;
        }

        return AUTOCOMPLETE_RESULT;
    }
}
