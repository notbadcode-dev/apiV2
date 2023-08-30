import { AUTOCOMPLETE_CONSTANT } from '@constant/autocomplete.constant';
import { IAutocompleteCommon } from '@model/autocomplete/autocomplete-common.model';

export interface IAutocompleteSearch<T> extends IAutocompleteCommon<T> {
    search?: string;
    skip: number;
    take: number;
    returnExcludedList: boolean;
}

export class IAutocompleteSearchHelper {
    static getDefault<T>(): IAutocompleteSearch<T> {
        return {
            skip: AUTOCOMPLETE_CONSTANT.DEFAULT_SKIP,
            take: AUTOCOMPLETE_CONSTANT.DEFAULT_TAKE,
            returnExcludedList: false,
            excludedItemList: new Array<T>(),
            excludedItemIdList: new Array<number>(),
            excludedItemContainTextList: new Array<string>(),
        };
    }
}
