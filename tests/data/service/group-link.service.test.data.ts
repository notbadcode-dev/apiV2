import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroup } from '@model/group/group.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { GenericTestData } from './generic.test.data';
import { PaginateTestData } from './paginate.test.data';

const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();
const GENERIC_TEST_DATA: GenericTestData = new GenericTestData();

export class GroupLinkServiceTestData {
    //#region Public methods

    //#region return GroupLinkEntity

    public getGroupLinkEntity(): GroupLinkEntity {
        const GROUP_LINK_ENTITY = new GroupLinkEntity();
        GROUP_LINK_ENTITY.id = 1;
        GROUP_LINK_ENTITY.name = 'Test Group';
        GROUP_LINK_ENTITY.userId = GENERIC_TEST_DATA.getUserId();
        GROUP_LINK_ENTITY.colorFrom = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.colorTo = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.gradientType = GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        GROUP_LINK_ENTITY.displayOrder = this.getNextDisplayOrder();
        return GROUP_LINK_ENTITY;
    }

    public getGroupLinkEntityWithLinkList(): GroupLinkEntity {
        const GROUP_LINK_ENTITY = this.getGroupLinkEntity();
        GROUP_LINK_ENTITY.linkList = [this.getLinkEntity()];
        return GROUP_LINK_ENTITY;
    }

    public getGroupLinkEntityWithDisplayOrderNull(): GroupLinkEntity {
        const GROUP_LINK_ENTITY = this.getGroupLinkEntity();
        GROUP_LINK_ENTITY.displayOrder = null;

        return GROUP_LINK_ENTITY;
    }

    public getNextDisplayOrder(): number {
        return 1;
    }

    //#endregion

    //#region return IGroup

    public getGroup(): IGroup {
        return {
            id: 1,
            name: 'Test Group',
            colorFrom: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            colorTo: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            gradientType: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
            linkList: [],
            tagList: [],
            displayOrder: this.getNextDisplayOrder(),
        };
    }

    public getGroupWithLinkList(): IGroup {
        return {
            id: 1,
            name: 'Test Group',
            colorFrom: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            colorTo: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            gradientType: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
            linkList: [this.getLink()],
            tagList: [],
        };
    }

    public getGroupCreate(): IGroup {
        return {
            ...this.getGroup(),
            id: 0,
        };
    }

    public getGroupCreateWithLinkList(): IGroup {
        return {
            ...this.getGroupWithLinkList(),
            id: 0,
        };
    }

    public getGroupWithEmptyName(): IGroup {
        return {
            ...this.getGroup(),
            name: '',
        };
    }

    public getGroupWithZeroId(): IGroup {
        return {
            ...this.getGroup(),
            id: 0,
        };
    }

    public getGroupLinkWithNullishId(): IGroup {
        return {
            ...this.getGroup(),
            id: Number(null),
        };
    }

    //#endregion

    //#region return IDeleteGroup

    public getDeleteGroup(): IDeleteGroup {
        return {
            id: this.getGroup().id,
            withLinkList: false,
        };
    }

    public getDeleteWithZeroId(): IDeleteGroup {
        return {
            ...this.getDeleteGroup(),
            id: 0,
        };
    }

    public getDeleteWithNullishId(): IDeleteGroup {
        return {
            ...this.getDeleteGroup(),
            id: Number(null),
        };
    }

    public getDeleteWithLinkListTrue(): IDeleteGroup {
        return {
            ...this.getDeleteGroup(),
            withLinkList: true,
        };
    }

    //#endregion

    //#region return LinkEntity

    public getLinkEntity(): LinkEntity {
        const LINK_ENTITY = new LinkEntity();
        LINK_ENTITY.id = 1;
        LINK_ENTITY.name = 'Test Link';
        LINK_ENTITY.url = 'https://www.testlink.com';
        LINK_ENTITY.userId = GENERIC_TEST_DATA.getUserId();
        LINK_ENTITY.groupLinkId = null;
        LINK_ENTITY.groupLink = null;
        return LINK_ENTITY;
    }

    //#endregion

    //#region return ILink

    public getLink(): ILink {
        return {
            id: 1,
            name: 'Link 1',
            url: 'https://www.link1.com',
            linkGroup: null,
            linkGroupId: null,
        };
    }

    public getLinkCreate(): ILink {
        return {
            ...this.getLink(),
            id: 0,
        };
    }

    //#endregion

    //#region return IPaginateItem<IGroup>

    getPaginateGroupLinkList(): IPaginateItem<IGroup> {
        return PAGINATE_TEST_DATA.getPaginateItemList<IGroup>(this.getGroupLinkList(PAGINATE_TEST_DATA.getPaginateItemListTotal()));
    }

    //#endregion

    //#region return throw exception

    public getArgumentErrorEmptyGroupLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_NAME_ARGUMENT);
    }

    public getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_ID_ARGUMENT);
    }

    public getInternalServerErrorNotMatchParamAndBodyId(): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
    }

    //#endregion

    //#endregion

    //#region Private methods

    private getGroupLinkList(numberOfGroupLinks: number): IGroup[] {
        return Array.from({ length: numberOfGroupLinks }).map((_, index) => {
            const ID: number = index + 1;
            const GROUP_LINK: IGroup = {
                id: ID,
                name: `Test group link ${ID}`,
                colorFrom: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
                colorTo: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
                gradientType: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
                linkList: [],
                tagList: [],
                displayOrder: this.getNextDisplayOrder(),
            };

            return GROUP_LINK;
        });
    }

    //#endregion
}
