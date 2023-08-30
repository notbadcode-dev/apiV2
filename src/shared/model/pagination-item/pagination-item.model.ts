import { PAGINATE_CONSTANT } from '@constant/paginate.constant';

export interface IPartialPaginateItem {
    take: number;
    currentPage?: number;
}

export class PartialPaginateItemHelper {
    static mapToObject(currentPage?: number, take?: number): IPartialPaginateItem {
        return {
            take: take ?? PAGINATE_CONSTANT.DEFAULT_TAKE,
            currentPage: currentPage ?? PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE,
        };
    }
}

export interface IPaginateItem<T> extends IPartialPaginateItem {
    skip?: number;
    total?: number;
    totalPages?: number | null;
    currentPageTotal?: number | null;
    itemList?: T[];
}

export class PaginateItemHelper {
    static getDefault<T>(): IPaginateItem<T> {
        return {
            skip: PAGINATE_CONSTANT.DEFAULT_SKIP,
            take: PAGINATE_CONSTANT.DEFAULT_TAKE,
            total: PAGINATE_CONSTANT.DEFAULT_TOTAL,
            currentPageTotal: PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE,
            totalPages: PAGINATE_CONSTANT.DEFAULT_TOTAL_PAGES,
            itemList: new Array<T>(),
        };
    }

    static getTotalPages(totalCount: number, startIndex: number, take: number): number {
        const TOTAL_COUNT: number = totalCount - startIndex;
        const TOTAL_PAGES: number = Math.ceil(TOTAL_COUNT / take);
        return TOTAL_PAGES;
    }

    static getCurrentPage(startIndex: number, take: number, currentPage?: number | null): number {
        if (!currentPage) {
            const CURRENT_PAGE: number = Math.ceil((startIndex + PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE) / take);
            return CURRENT_PAGE;
        }

        return currentPage;
    }

    static getCurrentPageStartIndex(startIndex: number, currentPage: number, take: number): number {
        const CURRENT_PAGE_START_INDEX: number = startIndex + (currentPage - PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE) * take;
        return CURRENT_PAGE_START_INDEX;
    }

    static getCurrentPageEndIndex(currentPageStartIndex: number, take: number, totalCount: number): number {
        return Math.min(currentPageStartIndex + take, totalCount);
    }

    static getCurrentPageTotal(currentPageEndIndex: number, currentPageStartIndex: number, take: number): number {
        return Math.min(currentPageEndIndex - currentPageStartIndex + PAGINATE_CONSTANT.DEFAULT_CURRENT_PAGE * 2, take);
    }
}

export interface IPaginateCalculateRequest {
    totalCount: number;
    startIndex: number;
    take: number;
    currentPage?: number | null;
}

export interface IPaginateCalculateResult {
    totalPages: number;
    currentPage: number;
    currentPageStartIndex: number;
    currentPageEndIndex: number;
    currentPageTotal: number;
    total: number;
}

export class PaginateCalculateHelper {
    static calculate(paginateCalculate: IPaginateCalculateRequest): IPaginateCalculateResult {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { totalCount: totalCount, startIndex, take } = paginateCalculate;

        const TOTAL_PAGES = PaginateItemHelper.getTotalPages(totalCount, startIndex, take);
        const CURRENT_PAGE = PaginateItemHelper.getCurrentPage(startIndex, take, paginateCalculate?.currentPage);

        const CURRENT_PAGE_START_INDEX = PaginateItemHelper.getCurrentPageStartIndex(startIndex, CURRENT_PAGE, take);
        const CURRENT_PAGE_END_INDEX = PaginateItemHelper.getCurrentPageEndIndex(CURRENT_PAGE_START_INDEX, take, totalCount);
        const CURRENT_PAGE_TOTAL = PaginateItemHelper.getCurrentPageTotal(CURRENT_PAGE_END_INDEX, CURRENT_PAGE_START_INDEX, take);

        const TOTAL: number = totalCount - startIndex;

        return {
            totalPages: TOTAL_PAGES,
            currentPage: CURRENT_PAGE,
            currentPageStartIndex: CURRENT_PAGE_START_INDEX,
            currentPageEndIndex: CURRENT_PAGE_END_INDEX,
            currentPageTotal: CURRENT_PAGE_TOTAL,
            total: TOTAL,
        };
    }

    static result<T>(paginateInfo: IPaginateCalculateResult, itemList: T[]): IPaginateItem<T> {
        return {
            skip: paginateInfo.currentPageStartIndex,
            take: paginateInfo.currentPageTotal,
            total: paginateInfo.total,
            currentPage: paginateInfo.currentPage,
            totalPages: paginateInfo.totalPages,
            currentPageTotal: paginateInfo.currentPageTotal,
            itemList: itemList || [],
        };
    }
}
