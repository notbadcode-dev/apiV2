import { AUTOCOMPLETE_CONSTANT } from '@constant/autocomplete.constant';
import { IAutocompleteCommon } from '@model/autocomplete/autocomplete-common.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';

export interface IAutocompleteResult<T> extends IAutocompleteCommon {
    search?: string;
    itemList: T[];
    lastUsedItemList: T[];
}

export class AutocompleteResultHelper {
    static mapFromAutocompleteSearch<T>(
        autocompleteSearch: IAutocompleteSearch,
        itemList: T[],
        lastUsedItemList: T[] = []
    ): IAutocompleteResult<T> {
        const SKIP_COUNT = autocompleteSearch?.skip ?? AUTOCOMPLETE_CONSTANT.DEFAULT_SKIP;
        const TAKE_COUNT = autocompleteSearch?.take ?? AUTOCOMPLETE_CONSTANT.DEFAULT_TAKE;

        const SLICED_ITEM_LIST = itemList.slice(SKIP_COUNT, SKIP_COUNT + TAKE_COUNT);

        const AUTOCOMPLETE_RESULT: IAutocompleteResult<T> = {
            search: autocompleteSearch.search,
            itemList: SLICED_ITEM_LIST,
            lastUsedItemList,
        };

        AUTOCOMPLETE_RESULT.excludedItemIdList = autocompleteSearch?.returnExcludedList ? autocompleteSearch.excludedItemIdList : [];
        AUTOCOMPLETE_RESULT.excludedItemContainTextList = autocompleteSearch?.returnExcludedList
            ? autocompleteSearch.excludedItemContainTextList
            : [];

        return AUTOCOMPLETE_RESULT;
    }
}
