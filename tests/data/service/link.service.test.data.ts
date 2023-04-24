import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { ITag } from '@model/tag/tag.model';

export class LinkServiceTestData {
    getLinkCreate(): ILinkCreate {
        return {
            name: 'Test',
            url: 'http://www.test.com',
        };
    }

    getLink(): ILink {
        return {
            id: 1,
            order: 0,
            name: 'Test',
            url: 'http://www.test.com',
            active: true,
            favorite: true,
            linkGroupId: null,
            linkGroup: null,
            tagList: new Array<ITag>(),
        };
    }

    getLinkAlternative(): ILink {
        return {
            id: 2,
            name: 'Test',
            url: 'http://www.test.com',
            active: true,
            favorite: true,
            linkGroupId: null,
            linkGroup: null,
            tagList: new Array<ITag>(),
        };
    }

    getLinkEntity(): LinkEntity {
        return {
            id: 1,
            name: 'Test',
            url: 'http://www.test.com',
            favorite: false,
            active: true,
            userId: this.getUserId(),
        };
    }

    getFavoriteLinkEntity(): LinkEntity {
        return {
            ...this.getLinkEntity(),
            favorite: true,
        };
    }

    getInactiveLinkEntity(): LinkEntity {
        return {
            ...this.getLinkEntity(),
            active: false,
        };
    }

    getLinkWithEmptyName(): ILink {
        return {
            ...this.getLink(),
            name: '',
        };
    }

    getLinkWithZeroId(): ILink {
        return {
            ...this.getLink(),
            id: 0,
        };
    }

    getLinkWithNullishId(): ILink {
        return {
            ...this.getLink(),
            id: Number(null),
        };
    }

    getLinkWithEmptyUrl(): ILink {
        return {
            ...this.getLink(),
            url: '',
        };
    }

    getLinkCreateWithEmptyName(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            name: '',
        };
    }

    getLinkCreateWithEmptyUrl(): ILinkCreate {
        return {
            ...this.getLinkCreate(),
            url: '',
        };
    }

    getPaginateLinkList(): IPaginateItem<ILink> {
        const TOTAL_LINKS = 10;
        const LINKS_PER_PAGE = 5;
        const CURRENT_PAGE = 1;
        const TOTAL_PAGES = Math.ceil(TOTAL_LINKS / LINKS_PER_PAGE);
        const linkList: ILink[] = [];

        // eslint-disable-next-line @typescript-eslint/naming-convention
        for (let i = 1; i <= TOTAL_LINKS; i++) {
            linkList.push({
                id: i,
                name: `Link ${i}`,
                url: `https://www.link${i}.com`,
                favorite: false,
                active: true,
            });
        }

        const PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
            skip: (CURRENT_PAGE - 1) * LINKS_PER_PAGE,
            take: LINKS_PER_PAGE,
            total: TOTAL_LINKS,
            totalPages: TOTAL_PAGES,
            currentPage: CURRENT_PAGE,
            currentPageTotal: LINKS_PER_PAGE,
            itemList: linkList.slice(0, LINKS_PER_PAGE),
        };

        return PAGINATE_LINK_LIST;
    }

    getSimplePaginateLinkList(): IPaginateItem<ILink> {
        return {
            totalPages: 1,
            currentPage: 10,
            take: 10,
        };
    }

    getSimpleWithUndefinedItemListPaginateLinkList(): IPaginateItem<ILink> {
        return { total: 0, itemList: undefined, take: 10 };
    }

    getArgumentErrorEmptyLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
    }

    getArgumentErrorEmptyLinkUrl(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
    }

    getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
    }

    getInternalServerErrorNotMatchParamAndBodyId(): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
    }

    getUserId(): number {
        return 1;
    }
}
