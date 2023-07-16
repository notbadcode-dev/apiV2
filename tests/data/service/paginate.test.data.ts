import { ERROR_MESSAGE_PAGINATION } from '@constant/error-message/error-message-paginate.constant';
import { ArgumentError } from '@error/argument.error';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export class PaginateTestData {
    public getPaginateWithTakeIsNull<T>(): IPaginateItem<T> {
        return {
            ...this.getPaginateWithEmptyList(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            take: null as any,
        };
    }

    public getPaginateWithTakeIsNaN<T>(): IPaginateItem<T> {
        return {
            ...this.getPaginateWithEmptyList(),
            take: NaN,
        };
    }

    public getPaginateWithTakeIsZero<T>(): IPaginateItem<T> {
        return {
            ...this.getPaginateWithEmptyList(),
            take: 0,
        };
    }

    public getArgumentErrorInvalidPaginate(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_PAGINATION.MALFORMED_PAGINATION);
    }

    public getPaginateWithEmptyList<T>(): IPaginateItem<T> {
        return {
            totalPages: 1,
            currentPage: 1,
            take: 10,
            skip: 0,
            total: 0,
            itemList: new Array<T>(),
        };
    }
}
