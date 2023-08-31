import { AUTOCOMPLETE_CONSTANT } from '@constant/autocomplete.constant';
import { IAutocompleteCommon } from '@model/autocomplete/autocomplete-common.model';

export interface IAutocompleteSearch extends IAutocompleteCommon {
    search?: string;
    skip: number;
    take: number;
    returnExcludedList: boolean;
    returnedLastUsedItems: boolean;
}

export class IAutocompleteSearchHelper {
    static getDefault(): IAutocompleteSearch {
        return {
            skip: AUTOCOMPLETE_CONSTANT.DEFAULT_SKIP,
            take: AUTOCOMPLETE_CONSTANT.DEFAULT_TAKE,
            returnExcludedList: false,
            returnedLastUsedItems: false,
            excludedItemIdList: new Array<number>(),
            excludedItemContainTextList: new Array<string>(),
        };
    }
}
