import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { ITag } from '@model/tag/tag.model';
import { GenericTestData } from '@testData/service/generic.test.data';
import { PaginateTestData } from '@testData/service/paginate.test.data';

const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();
const GENERIC_TEST_DATA: GenericTestData = new GenericTestData();

export class LinkServiceTestData {
    //#region Public methods

    //#region LinkEntity

    public getLinkEntity(): LinkEntity {
        const LINK_ENTITY = new LinkEntity();
        LINK_ENTITY.id = 1;
        LINK_ENTITY.name = 'Test';
        LINK_ENTITY.url = 'http://www.test.com';
        LINK_ENTITY.favorite = false;
        LINK_ENTITY.active = true;
        LINK_ENTITY.userId = GENERIC_TEST_DATA.getUserId();
        LINK_ENTITY.displayOrder = 1;

        return LINK_ENTITY;
    }

    public getLinkEntityList(): LinkEntity[] {
        return new Array<LinkEntity>(this.getLinkEntity());
    }

    public getLinkEntityEmptyList(): LinkEntity[] {
        return new Array<LinkEntity>();
    }

    public getLinkEntityWithZeroId(): LinkEntity {
        const LINK_ENTITY = this.getLinkEntity();
        LINK_ENTITY.id = 0;

        return LINK_ENTITY;
    }

    public getFavoriteLinkEntity(): LinkEntity {
        const LINK_ENTITY = this.getLinkEntity();
        LINK_ENTITY.favorite = true;

        return LINK_ENTITY;
    }

    public getInactiveLinkEntity(): LinkEntity {
        const LINK_ENTITY = this.getLinkEntity();
        LINK_ENTITY.active = false;

        return LINK_ENTITY;
    }

    public getLinkEntityWithDisplayOrderNull(): LinkEntity {
        const LINK_ENTITY = this.getLinkEntity();
        LINK_ENTITY.displayOrder = null;

        return LINK_ENTITY;
    }

    public getNextDisplayOrder(): number {
        return this.getLinkEntity().displayOrder ?? 1;
    }

    //#endregion

    //#region return ILink

    public getLink(): ILink {
        return {
            id: 1,
            displayOrder: 0,
            name: 'Test',
            url: 'http://www.test.com',
            active: true,
            favorite: true,
            linkGroupId: null,
            linkGroup: null,
            tagList: new Array<ITag>(),
        };
    }

    public getLinkAlternative(): ILink {
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

    public getLinkWithEmptyName(): ILink {
        return {
            ...this.getLink(),
            name: '',
        };
    }

    public getLinkWithInactive(): ILink {
        return {
            ...this.getLink(),
            active: false,
        };
    }

    public getLinkWithUnfavorite(): ILink {
        return {
            ...this.getLink(),
            favorite: false,
        };
    }

    public getLinkWithZeroId(): ILink {
        return {
            ...this.getLink(),
            id: 0,
        };
    }

    public getLinkWithNullishId(): ILink {
        return {
            ...this.getLink(),
            id: Number(null),
        };
    }

    public getLinkWithEmptyUrl(): ILink {
        return {
            ...this.getLink(),
            url: '',
        };
    }

    //#endregion

    //#region return ILinkCreate

    getLinkCreate(): ILinkCreate {
        return {
            name: 'Test',
            url: 'http://www.test.com',
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

    //#endregion

    //#region return IPaginateItem<ILink>

    getPaginateLinkList(): IPaginateItem<ILink> {
        return PAGINATE_TEST_DATA.getPaginateItemList<ILink>(this.getLinkList(PAGINATE_TEST_DATA.getPaginateItemListTotal()));
    }

    getSimpleWithUndefinedItemListPaginateLinkList(): IPaginateItem<ILink> {
        return { total: 0, itemList: undefined, take: 10 };
    }

    //#endregion

    //#region return throw exception

    public getArgumentErrorEmptyLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
    }

    public getArgumentErrorEmptyLinkUrl(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
    }

    public getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
    }

    public getInternalServerErrorNotMatchParamAndBodyId(): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
    }

    public getInternalServerErrorNotDeleteLink(linkName: string): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_LINK.COULD_NOT_DELETE_LINK(linkName));
    }

    //#endregion

    //#endregion

    //#region Private methods

    private getLinkList(numberOfLinks: number): ILink[] {
        return Array.from({ length: numberOfLinks }).map((_, index) => {
            const ID: number = index + 1;
            const LINK: ILink = {
                id: ID,
                name: `Test link ${ID}`,
                url: `https://www.testUrl${ID}.com`,
                favorite: false,
                active: true,
            };

            return LINK;
        });
    }

    //#endregion
}
