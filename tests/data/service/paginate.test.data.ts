import { ERROR_MESSAGE_PAGINATION } from '@constant/error-message/error-message-paginate.constant';
import { ArgumentError } from '@error/argument.error';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export class PaginateTestData {
    //#region Public methods

    //#region return : IPaginateItem<T>

    public getPaginateItemListTotal(): number {
        return 10;
    }

    public getPaginateItemsPerPage(): number {
        return 5;
    }

    public getPaginateCurrentPage(): number {
        return 1;
    }

    public getPaginateItemList<T>(itemList: T[]): IPaginateItem<T> {
        const ITEM_LIST_TOTAL = this.getPaginateItemListTotal();
        const ITEMS_PER_PAGE = this.getPaginateItemsPerPage();
        const CURRENT_PAGE = this.getPaginateCurrentPage();
        const TOTAL_PAGES = Math.ceil(ITEM_LIST_TOTAL / ITEMS_PER_PAGE);

        const PAGINATE_ITEM_LIST: IPaginateItem<T> = {
            skip: (CURRENT_PAGE - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
            total: ITEM_LIST_TOTAL,
            totalPages: TOTAL_PAGES,
            currentPage: CURRENT_PAGE,
            currentPageTotal: ITEMS_PER_PAGE,
            itemList: itemList.slice(0, ITEMS_PER_PAGE),
        };

        return PAGINATE_ITEM_LIST;
    }

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

    //#endregion

    //#endregion
}
