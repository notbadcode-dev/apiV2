import { IAutocompleteCommon } from '@model/autocomplete/autocomplete-common.model';

export interface IAutocompleteResult<T> extends IAutocompleteCommon<T> {
    search?: string;
    itemList: T[];
}
