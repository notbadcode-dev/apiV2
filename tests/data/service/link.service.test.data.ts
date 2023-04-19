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
        const totalLinks = 10;
        const linksPerPage = 5;
        const currentPage = 1;
        const totalPages = Math.ceil(totalLinks / linksPerPage);
        const linkList: ILink[] = [];

        for (let i = 1; i <= totalLinks; i++) {
            linkList.push({
                id: i,
                name: `Link ${i}`,
                url: `https://www.link${i}.com`,
                favorite: false,
                active: true,
            });
        }

        const paginateLinkList: IPaginateItem<ILink> = {
            skip: (currentPage - 1) * linksPerPage,
            take: linksPerPage,
            total: totalLinks,
            totalPages: totalPages,
            currentPage: currentPage,
            currentPageTotal: linksPerPage,
            itemList: linkList.slice(0, linksPerPage),
        };

        return paginateLinkList;
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
