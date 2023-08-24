import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroup } from '@model/group/group.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';

export class GroupLinkTestData {
    public getGroupCreate(): IGroup {
        return {
            id: 1,
            name: 'Test Group',
            linkList: [],
        };
    }

    public getLink(): ILink {
        return {
            id: 1,
            name: 'Link 1',
            url: 'https://www.link1.com',
        };
    }

    public getGroupCreateWithLinks(): IGroup {
        const LINK_ONE: ILink = this.getLink();

        const LINK_TWO: ILink = {
            id: 2,
            name: 'Link 2',
            url: 'https://www.link2.com',
        };

        return {
            id: 2,
            name: 'Test Group with Links',
            linkList: [LINK_ONE, LINK_TWO],
        };
    }

    public getGroupWithEmptyName(): IGroup {
        return {
            id: 3,
            name: '',
            linkList: [],
        };
    }

    public getArgumentErrorEmptyGroupLinkName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_NAME_ARGUMENT);
    }

    public getGroupLinkEntity(): GroupLinkEntity {
        const GROUP_LINK_ENTITY = new GroupLinkEntity();
        GROUP_LINK_ENTITY.id = 1;
        GROUP_LINK_ENTITY.name = 'Test Group';
        GROUP_LINK_ENTITY.userId = 123;
        GROUP_LINK_ENTITY.colorFrom = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.colorTo = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.gradientType = GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        return GROUP_LINK_ENTITY;
    }

    public getGroupLinkEntityWithLinkList(): GroupLinkEntity {
        const GROUP_LINK_ENTITY = new GroupLinkEntity();
        GROUP_LINK_ENTITY.id = 1;
        GROUP_LINK_ENTITY.name = 'Test Group';
        GROUP_LINK_ENTITY.userId = 123;
        GROUP_LINK_ENTITY.colorFrom = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.colorTo = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY.gradientType = GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        GROUP_LINK_ENTITY.linkList = [this.getLinkEntity()];
        return GROUP_LINK_ENTITY;
    }

    public getLinkEntity(): LinkEntity {
        const LINK_ENTITY = new LinkEntity();
        LINK_ENTITY.id = 1;
        LINK_ENTITY.name = 'Test Link';
        LINK_ENTITY.url = 'https://www.testlink.com';
        LINK_ENTITY.userId = 123;
        return LINK_ENTITY;
    }

    public getGroupLink(): IGroup {
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

    public getGroupLinkWithLinkList(): IGroup {
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

    public getGroupLinkUpdated(): IGroup {
        return {
            id: 1,
            name: 'Updated Group',
            colorFrom: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            colorTo: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
            gradientType: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
            linkList: [],
            tagList: [],
        };
    }

    public getDeleteGroup(): IDeleteGroup {
        return {
            id: 1,
            withLinkList: true,
        };
    }

    public getGroupLinkEntityList(): GroupLinkEntity[] {
        const GROUP_LINK_ENTITY_ONE = new GroupLinkEntity();
        GROUP_LINK_ENTITY_ONE.id = 1;
        GROUP_LINK_ENTITY_ONE.name = 'Group 1';
        GROUP_LINK_ENTITY_ONE.userId = 123;
        GROUP_LINK_ENTITY_ONE.colorFrom = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY_ONE.colorTo = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY_ONE.gradientType = GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        GROUP_LINK_ENTITY_ONE.linkList = [];

        const GROUP_LINK_ENTITY_TWO = new GroupLinkEntity();
        GROUP_LINK_ENTITY_TWO.id = 1;
        GROUP_LINK_ENTITY_TWO.name = 'Group 1';
        GROUP_LINK_ENTITY_TWO.userId = 123;
        GROUP_LINK_ENTITY_TWO.colorFrom = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY_TWO.colorTo = GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        GROUP_LINK_ENTITY_TWO.gradientType = GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        GROUP_LINK_ENTITY_TWO.linkList = [];

        return [GROUP_LINK_ENTITY_ONE, GROUP_LINK_ENTITY_TWO];
    }

    public getPaginateGroupLinkList(): IPaginateItem<IGroup> {
        const TOTAL_LINKS = 10;
        const LINKS_PER_PAGE = 5;
        const CURRENT_PAGE = 1;
        const TOTAL_PAGES = Math.ceil(TOTAL_LINKS / LINKS_PER_PAGE);
        const GROUP_LINK_LIST: IGroup[] = [];

        // eslint-disable-next-line @typescript-eslint/naming-convention
        for (let i = 1; i <= TOTAL_LINKS; i++) {
            const GROUP_LINK: IGroup = {
                id: 1,
                name: `Link ${i}`,
                colorFrom: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
                colorTo: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
                gradientType: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
                linkList: [],
                tagList: [],
            };

            GROUP_LINK_LIST.push(GROUP_LINK);
        }

        const PAGINATE_LINK_LIST: IPaginateItem<IGroup> = {
            skip: (CURRENT_PAGE - 1) * LINKS_PER_PAGE,
            take: LINKS_PER_PAGE,
            total: TOTAL_LINKS,
            totalPages: TOTAL_PAGES,
            currentPage: CURRENT_PAGE,
            currentPageTotal: LINKS_PER_PAGE,
            itemList: GROUP_LINK_LIST.slice(0, LINKS_PER_PAGE),
        };

        return PAGINATE_LINK_LIST;
    }

    public getUserId(): number {
        return 1;
    }
}
