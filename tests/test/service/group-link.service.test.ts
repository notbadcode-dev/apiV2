import { GroupLinkEntity } from '@entity/group_link.entity';
import { ArgumentError } from '@error/argument.error';
import { LinkGroupEntityToGroupMapper } from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroup } from '@model/group/group.model';
import { GroupLinkRepository } from '@repository/group-link.repository/group-link.repository';
import { LinkRepository } from '@repository/link.repository/link.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { GroupLinkService } from '@service/group-link.service/group-link.service';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { TokenService } from '@service/middleware/token.service/token.service';
import { GenericTestData } from '@testData/service/generic.test.data';
import { GroupLinkServiceTestData } from '@testData/service/group-link.service.test.data';
import { anyNumber, anything, instance, mock, verify, when } from 'ts-mockito';

const GROUP_LINK_SERVICE_TEST_DATA: GroupLinkServiceTestData = new GroupLinkServiceTestData();
// const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();
const GENERIC_TEST_DATA: GenericTestData = new GenericTestData();

let groupLinkServiceMock: IGroupLinkService;
let groupLinkRepositoryMock: GroupLinkRepository;
let linkGroupEntityToGroupMapper: LinkGroupEntityToGroupMapper;
let tokenServiceMock: TokenService;
let linkRepositoryMock: LinkRepository;
let globalUtilValidateServiceMock: GlobalUtilValidateService;

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    generateGroupLinkService();
});

const GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR = GROUP_LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyGroupLinkName();
const GROUP_LINK_WRONG_ID_ARGUMENT_ERROR: ArgumentError = GROUP_LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();

// const LINK_EMPTY_URL_ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkUrl();
const USER_ID = GENERIC_TEST_DATA.getUserId();
const GROUP_LINK: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroup();
const GROUP_LINK_ENTITY: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntity();
// const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getPaginateLinkList();
// const ARGUMENT_ERROR: ArgumentError = LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();

describe('createGroupLink', () => {
    it('Creating a group link with empty name should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_EMPTY_NAME: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithEmptyName();

        // Act & Assert
        await expect(groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE_EMPTY_NAME)).rejects.toThrowError(
            GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR
        );
    });

    it('Creating a group link without link list should return a group link entity', async () => {
        // Arrange
        const GROUP_LINK_CREATE: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupCreate();

        when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(groupLinkRepositoryMock.create(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE);

        // Assert
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK.id);
    });

    it('Creating a group link with link list should return a group link entity', async () => {
        // Arrange
        const GROUP_LINK_CREATE_WITH_LINK_LIST: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupCreateWithLinkList();
        const GROUP_LINK_ENTITY_WITH_LIST_LIST: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntityWithLinkList();
        const GROUP_LINK_WITH_LIST_LIST: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithLinkList();

        when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(groupLinkRepositoryMock.create(anything())).thenResolve(GROUP_LINK_ENTITY_WITH_LIST_LIST);
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK_WITH_LIST_LIST);
        when(linkRepositoryMock.createList(anything())).thenResolve(GROUP_LINK_ENTITY_WITH_LIST_LIST?.linkList ?? []);

        // Act
        const RESULT = await groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE_WITH_LINK_LIST);

        // Assert
        verify(linkRepositoryMock.createList(anything())).once();
        expect(RESULT?.linkList.length).toEqual(GROUP_LINK_CREATE_WITH_LINK_LIST.linkList.length);
        expect(RESULT?.id).toEqual(GROUP_LINK_WITH_LIST_LIST.id);
    });
});

describe('updateGroupLink', () => {
    it('Updating a group link with empty name should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_EMPTY_NAME: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithEmptyName();

        // Act & Assert
        await expect(
            groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_EMPTY_NAME.id, GROUP_LINK_CREATE_EMPTY_NAME)
        ).rejects.toThrowError(GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR);
    });

    it('Updating a group link with zero ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_ZERO_ID: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithZeroId();

        // Act & Assert
        await expect(groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_ZERO_ID.id, GROUP_LINK_CREATE_ZERO_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Updating a group link with nullish ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_NULLISH_ID: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkWithNullishId();

        // Act & Assert
        await expect(
            groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_NULLISH_ID.id, GROUP_LINK_CREATE_NULLISH_ID)
        ).rejects.toThrowError(GROUP_LINK_WRONG_ID_ARGUMENT_ERROR);
    });

    it('Updating a group link should return a group link entity', async () => {
        // Arrange
        when(groupLinkRepositoryMock.getById(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(groupLinkRepositoryMock.update(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.updateGroupLink(GROUP_LINK.id, GROUP_LINK);

        // Assert
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });

    it('Updating a link with display order null should return a link entity', async () => {
        // Arrange
        const LINK_ENTITY_WITH_DISPLAY_ORDER_NULL: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntityWithDisplayOrderNull();

        when(groupLinkRepositoryMock.getById(anything())).thenResolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
        when(groupLinkRepositoryMock.update(anything())).thenResolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
        when(groupLinkRepositoryMock.getNextDisplayOrder(anyNumber())).thenResolve(GROUP_LINK_SERVICE_TEST_DATA.getNextDisplayOrder());
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.updateGroupLink(GROUP_LINK.id, GROUP_LINK);

        // Assert
        expect(RESULT?.displayOrder).not.toBeNull();
        expect(RESULT?.displayOrder).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });
});

describe('deleteGroupLink', () => {
    it('Deleting a link with zero ID should throw an argument error', async () => {
        // Arrange
        const DELETE_GROUP_WITH_ZERO_ID: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithZeroId();

        // Act & Assert
        await expect(groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_ZERO_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Deleting a link with nullish ID should throw an argument error', async () => {
        // Arrange
        const DELETE_GROUP_WITH_NULLISH_ID: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithNullishId();

        // Act & Assert
        await expect(groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_NULLISH_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Should delete non existing link and return true', async () => {
        const DELETE_GROUP: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteGroup();

        // Arrange
        when(groupLinkRepositoryMock.getById(DELETE_GROUP.id)).thenResolve(GROUP_LINK_ENTITY);
        when(groupLinkRepositoryMock.delete(DELETE_GROUP)).thenResolve(true);

        // Act
        const RESULT: boolean = await groupLinkServiceMock.deleteGroupLink(DELETE_GROUP);

        // Assert
        expect(RESULT).toBe(true);
    });

    it('Should delete non existing link and return false', async () => {
        const DELETE_GROUP: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteGroup();

        // Arrange
        when(groupLinkRepositoryMock.getById(DELETE_GROUP.id)).thenResolve(GROUP_LINK_ENTITY);
        when(groupLinkRepositoryMock.delete(DELETE_GROUP)).thenResolve(false);

        // Act
        const RESULT: boolean = await groupLinkServiceMock.deleteGroupLink(DELETE_GROUP);

        // Assert
        expect(RESULT).toBe(false);
    });

    it('Should delete existing link and return true', async () => {
        const DELETE_GROUP_WITH_LINK_LIST_TRUE: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithLinkListTrue();

        // Arrange
        when(groupLinkRepositoryMock.getById(DELETE_GROUP_WITH_LINK_LIST_TRUE.id)).thenResolve(GROUP_LINK_ENTITY);
        when(groupLinkRepositoryMock.delete(DELETE_GROUP_WITH_LINK_LIST_TRUE)).thenResolve(true);

        // Act
        const RESULT: boolean = await groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_LINK_LIST_TRUE);

        // Assert
        verify(linkRepositoryMock.deleteList(anything())).once();
        expect(RESULT).toBe(true);
    });
});

describe('getGroupLink', () => {
    it('Getting a group link with zero ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_ZERO_ID: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithZeroId();

        // Act & Assert
        await expect(groupLinkServiceMock.getGroupLink(GROUP_LINK_CREATE_ZERO_ID.id)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Getting a group link with nullish ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_NULLISH_ID: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkWithNullishId();

        // Act & Assert
        await expect(groupLinkServiceMock.getGroupLink(GROUP_LINK_CREATE_NULLISH_ID.id)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Should return a group link', async () => {
        // Arrange
        when(groupLinkRepositoryMock.getById(anyNumber())).thenResolve(GROUP_LINK_ENTITY);
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.getGroupLink(GROUP_LINK.id);

        // Assert
        expect(RESULT?.name).not.toBeNull();
        expect(RESULT?.name.length).toBeGreaterThan(0);
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });
});

describe('getGroupLinkList', () => {
    it('Should return a list of links', async () => {
        // Arrange
        when(groupLinkRepositoryMock.getAll()).thenResolve([GROUP_LINK_ENTITY]);
        when(linkGroupEntityToGroupMapper.map(GROUP_LINK_ENTITY)).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.getGroupLinkList();

        // Assert
        expect(RESULT.length).toEqual([GROUP_LINK_ENTITY].length);
        expect(RESULT.at(0)?.id).toEqual(GROUP_LINK?.id);
    });

    it('Should return a empty list of links', async () => {
        // Arrange
        when(groupLinkRepositoryMock.getAll()).thenResolve([]);

        // Act
        const RESULT = await groupLinkServiceMock.getGroupLinkList();

        // Assert
        expect(RESULT.length).toEqual(0);
    });
});

// describe('getPaginateLinkList', () => {
//     it('Should return a paginated list of links', async () => {
//         // Arrange
//         const EXPECTED_ITEM_LIST: ILink[] = [LINK];
//         const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
//             itemList: EXPECTED_ITEM_LIST,
//             total: PAGINATE_LINK_LIST.total,
//             totalPages: PAGINATE_LINK_LIST.totalPages,
//             currentPage: PAGINATE_LINK_LIST.currentPage,
//             take: PAGINATE_LINK_LIST.take,
//         };
//         when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve({
//             itemList: [LINK_ENTITY],
//             total: PAGINATE_LINK_LIST.total,
//             totalPages: PAGINATE_LINK_LIST.totalPages,
//             currentPage: PAGINATE_LINK_LIST.currentPage,
//             take: PAGINATE_LINK_LIST.take,
//         });

//         // Act
//         const RESULT: IPaginateItem<ILink> = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

//         // Assert
//         expect(RESULT.itemList?.length).toEqual(EXPECTED_PAGINATE_LINK_LIST.itemList?.length);
//     });

//     it('Should return an empty paginated list when no links are available', async () => {
//         // Arrange
//         const EXPECTED_ITEM_LIST: ILink[] = [];
//         const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
//             itemList: EXPECTED_ITEM_LIST,
//             total: PAGINATE_LINK_LIST.total,
//             totalPages: PAGINATE_LINK_LIST.totalPages,
//             currentPage: PAGINATE_LINK_LIST.currentPage,
//             take: PAGINATE_LINK_LIST.take,
//         };
//         when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve({
//             itemList: [],
//             total: PAGINATE_LINK_LIST.total,
//             totalPages: PAGINATE_LINK_LIST.totalPages,
//             currentPage: PAGINATE_LINK_LIST.currentPage,
//             take: PAGINATE_LINK_LIST.take,
//         });

//         // Act
//         const RESULT: IPaginateItem<ILink> = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

//         // Assert
//         expect(RESULT).toEqual(EXPECTED_PAGINATE_LINK_LIST);
//     });

//     it('Should throw an error when there is an error getting paginated links', async () => {
//         // Arrange
//         const ERROR_MESSAGE = LINK_SERVICE_TEST_DATA.getMessageError();
//         when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenReject(new Error(ERROR_MESSAGE));

//         // Act & Assert
//         await expect(linkService.getPaginateLinkList(PAGINATE_LINK_LIST)).rejects.toThrowError(ERROR_MESSAGE);
//     });

//     it('Should return an empty list when the itemList property of the paginateLinkList parameter is undefined or null', async () => {
//         // Act
//         const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

//         // Assert
//         expect(RESULT.itemList).toEqual([]);
//     });

//     it('Should return an empty list when no links are available for pagination', async () => {
//         // Arrange
//         const PAGINATE_LINK_LIST_WITH_EMPTY_LIST: IPaginateItem<LinkEntity> = PAGINATE_TEST_DATA.getPaginateWithEmptyList();

//         when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve(PAGINATE_LINK_LIST_WITH_EMPTY_LIST);

//         // Act
//         const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

//         // Assert
//         expect(RESULT?.itemList?.length ?? 0).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
//         expect(RESULT.total).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
//     });
// });

function generateGroupLinkService(): void {
    groupLinkRepositoryMock = mock(GroupLinkRepository);
    linkGroupEntityToGroupMapper = mock(LinkGroupEntityToGroupMapper);
    tokenServiceMock = mock(TokenService);
    linkRepositoryMock = mock(LinkRepository);
    globalUtilValidateServiceMock = mock(GlobalUtilValidateService);

    groupLinkServiceMock = new GroupLinkService(
        instance(groupLinkRepositoryMock),
        instance(linkGroupEntityToGroupMapper),
        instance(tokenServiceMock),
        instance(linkRepositoryMock),
        instance(globalUtilValidateServiceMock)
    );
}
