import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export interface IGlobalUtilValidateService {
    controlSameIdOnParamAndBody(paramId: number, bodyId: number): void;

    validatePaginate<T>(paginateList: IPaginateItem<T>): void;
}
