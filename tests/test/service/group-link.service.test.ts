import { GroupLinkEntity } from '@entity/group_link.entity';
import { ArgumentError } from '@error/argument.error';
import { LinkGroupEntityToGroupMapper } from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { IDeleteGroup } from '@model/group/delete-group.model';
import { IGroupLink } from '@model/group/group-link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { GroupLinkRepository } from '@repository/group-link.repository/group-link.repository';
import { LinkRepository } from '@repository/link.repository/link.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { GroupLinkService } from '@service/group-link.service/group-link.service';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { TokenService } from '@service/middleware/token.service/token.service';
import { GenericTestData } from '@testData/service/generic.test.data';
import { GroupLinkServiceTestData } from '@testData/service/group-link.service.test.data';
import { PaginateTestData } from '@testData/service/paginate.test.data';
import { anyNumber, anything, instance, mock, verify, when } from 'ts-mockito';

//#region Attributes

let _groupLinkServiceMock: IGroupLinkService;
let _groupLinkRepositoryMock: GroupLinkRepository;
let _linkGroupEntityToGroupMapperMock: LinkGroupEntityToGroupMapper;
let _tokenServiceMock: TokenService;
let _linkRepositoryMock: LinkRepository;
let _globalUtilValidateServiceMock: GlobalUtilValidateService;

//#endregion

//#region Constructor

function generateGroupLinkService(): void {
    _groupLinkRepositoryMock = mock(GroupLinkRepository);
    _linkGroupEntityToGroupMapperMock = mock(LinkGroupEntityToGroupMapper);
    _tokenServiceMock = mock(TokenService);
    _linkRepositoryMock = mock(LinkRepository);
    _globalUtilValidateServiceMock = mock(GlobalUtilValidateService);

    _groupLinkServiceMock = new GroupLinkService(
        instance(_groupLinkRepositoryMock),
        instance(_linkGroupEntityToGroupMapperMock),
        instance(_tokenServiceMock),
        instance(_linkRepositoryMock),
        instance(_globalUtilValidateServiceMock)
    );
}

beforeEach(() => {
    generateGroupLinkService();
});

//#endregion

//#region Test data

const GROUP_LINK_SERVICE_TEST_DATA: GroupLinkServiceTestData = new GroupLinkServiceTestData();
const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();
const GENERIC_TEST_DATA: GenericTestData = new GenericTestData();

const GROUP_LINK: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroup();
const GROUP_LINK_ENTITY: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntity();
const GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR = GROUP_LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyGroupLinkName();
const GROUP_LINK_WRONG_ID_ARGUMENT_ERROR: ArgumentError = GROUP_LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();
const PAGINATE_GROUP_LINK_LIST: IPaginateItem<IGroupLink> = GROUP_LINK_SERVICE_TEST_DATA.getPaginateGroupLinkList();
const USER_ID = GENERIC_TEST_DATA.getUserId();

//#endregion

describe('createGroupLink', () => {
    it('Creating a group link with empty name should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_EMPTY_NAME: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithEmptyName();

        // Act & Assert
        await expect(_groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE_EMPTY_NAME)).rejects.toThrowError(
            GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR
        );
    });

    it('Creating a group link without link list should return a group link entity', async () => {
        // Arrange
        const GROUP_LINK_CREATE: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupCreate();

        when(_tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(_groupLinkRepositoryMock.create(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(_linkGroupEntityToGroupMapperMock.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await _groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE);

        // Assert
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK.id);
    });

    it('Creating a group link with link list should return a group link entity', async () => {
        // Arrange
        const GROUP_LINK_CREATE_WITH_LINK_LIST: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupCreateWithLinkList();
        const GROUP_LINK_ENTITY_WITH_LIST_LIST: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntityWithLinkList();
        const GROUP_LINK_WITH_LIST_LIST: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithLinkList();

        when(_tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(_groupLinkRepositoryMock.create(anything())).thenResolve(GROUP_LINK_ENTITY_WITH_LIST_LIST);
        when(_linkGroupEntityToGroupMapperMock.map(anything())).thenReturn(GROUP_LINK_WITH_LIST_LIST);
        when(_linkRepositoryMock.createList(anything())).thenResolve(GROUP_LINK_ENTITY_WITH_LIST_LIST?.linkList ?? []);

        // Act
        const RESULT = await _groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE_WITH_LINK_LIST);

        // Assert
        verify(_linkRepositoryMock.createList(anything())).once();
        expect(RESULT?.linkList.length).toEqual(GROUP_LINK_CREATE_WITH_LINK_LIST.linkList.length);
        expect(RESULT?.id).toEqual(GROUP_LINK_WITH_LIST_LIST.id);
    });
});

describe('updateGroupLink', () => {
    it('Updating a group link with empty name should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_EMPTY_NAME: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithEmptyName();

        // Act & Assert
        await expect(
            _groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_EMPTY_NAME.id, GROUP_LINK_CREATE_EMPTY_NAME)
        ).rejects.toThrowError(GROUP_LINK_EMPTY_NAME_ARGUMENT_ERROR);
    });

    it('Updating a group link with zero ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_ZERO_ID: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithZeroId();

        // Act & Assert
        await expect(_groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_ZERO_ID.id, GROUP_LINK_CREATE_ZERO_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Updating a group link with nullish ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_NULLISH_ID: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkWithNullishId();

        // Act & Assert
        await expect(
            _groupLinkServiceMock.updateGroupLink(GROUP_LINK_CREATE_NULLISH_ID.id, GROUP_LINK_CREATE_NULLISH_ID)
        ).rejects.toThrowError(GROUP_LINK_WRONG_ID_ARGUMENT_ERROR);
    });

    it('Updating a group link should return a group link entity', async () => {
        // Arrange
        when(_groupLinkRepositoryMock.getById(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(_groupLinkRepositoryMock.update(anything())).thenResolve(GROUP_LINK_ENTITY);
        when(_linkGroupEntityToGroupMapperMock.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await _groupLinkServiceMock.updateGroupLink(GROUP_LINK.id, GROUP_LINK);

        // Assert
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });

    it('Updating a group link with display order null should return a link entity', async () => {
        // Arrange
        const LINK_ENTITY_WITH_DISPLAY_ORDER_NULL: GroupLinkEntity = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkEntityWithDisplayOrderNull();

        when(_groupLinkRepositoryMock.getById(anything())).thenResolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
        when(_groupLinkRepositoryMock.update(anything())).thenResolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
        when(_groupLinkRepositoryMock.getNextDisplayOrder(anyNumber())).thenResolve(GROUP_LINK_SERVICE_TEST_DATA.getNextDisplayOrder());
        when(_linkGroupEntityToGroupMapperMock.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await _groupLinkServiceMock.updateGroupLink(GROUP_LINK.id, GROUP_LINK);

        // Assert
        expect(RESULT?.displayOrder).not.toBeNull();
        expect(RESULT?.displayOrder).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });
});

describe('deleteGroupLink', () => {
    it('Deleting a group link with zero ID should throw an argument error', async () => {
        // Arrange
        const DELETE_GROUP_WITH_ZERO_ID: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithZeroId();

        // Act & Assert
        await expect(_groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_ZERO_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Deleting a group link with nullish ID should throw an argument error', async () => {
        // Arrange
        const DELETE_GROUP_WITH_NULLISH_ID: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithNullishId();

        // Act & Assert
        await expect(_groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_NULLISH_ID)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Should delete non existing group link and return true', async () => {
        const DELETE_GROUP: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteGroup();

        // Arrange
        when(_groupLinkRepositoryMock.getById(DELETE_GROUP.id)).thenResolve(GROUP_LINK_ENTITY);
        when(_groupLinkRepositoryMock.delete(DELETE_GROUP)).thenResolve(true);

        // Act
        const RESULT: boolean = await _groupLinkServiceMock.deleteGroupLink(DELETE_GROUP);

        // Assert
        expect(RESULT).toBe(true);
    });

    it('Should delete non existing group link and return false', async () => {
        const DELETE_GROUP: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteGroup();

        // Arrange
        when(_groupLinkRepositoryMock.getById(DELETE_GROUP.id)).thenResolve(GROUP_LINK_ENTITY);
        when(_groupLinkRepositoryMock.delete(DELETE_GROUP)).thenResolve(false);

        // Act
        const RESULT: boolean = await _groupLinkServiceMock.deleteGroupLink(DELETE_GROUP);

        // Assert
        expect(RESULT).toBe(false);
    });

    it('Should delete existing group link and return true', async () => {
        const DELETE_GROUP_WITH_LINK_LIST_TRUE: IDeleteGroup = GROUP_LINK_SERVICE_TEST_DATA.getDeleteWithLinkListTrue();

        // Arrange
        when(_groupLinkRepositoryMock.getById(DELETE_GROUP_WITH_LINK_LIST_TRUE.id)).thenResolve(GROUP_LINK_ENTITY);
        when(_groupLinkRepositoryMock.delete(DELETE_GROUP_WITH_LINK_LIST_TRUE)).thenResolve(true);

        // Act
        const RESULT: boolean = await _groupLinkServiceMock.deleteGroupLink(DELETE_GROUP_WITH_LINK_LIST_TRUE);

        // Assert
        verify(_linkRepositoryMock.deleteList(anything())).once();
        expect(RESULT).toBe(true);
    });
});

describe('getGroupLink', () => {
    it('Getting a group link with zero ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_ZERO_ID: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupWithZeroId();

        // Act & Assert
        await expect(_groupLinkServiceMock.getGroupLink(GROUP_LINK_CREATE_ZERO_ID.id)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Getting a group link with nullish ID should throw an argument error', async () => {
        // Arrange
        const GROUP_LINK_CREATE_NULLISH_ID: IGroupLink = GROUP_LINK_SERVICE_TEST_DATA.getGroupLinkWithNullishId();

        // Act & Assert
        await expect(_groupLinkServiceMock.getGroupLink(GROUP_LINK_CREATE_NULLISH_ID.id)).rejects.toThrowError(
            GROUP_LINK_WRONG_ID_ARGUMENT_ERROR
        );
    });

    it('Should return a group link', async () => {
        // Arrange
        when(_groupLinkRepositoryMock.getById(anyNumber())).thenResolve(GROUP_LINK_ENTITY);
        when(_linkGroupEntityToGroupMapperMock.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await _groupLinkServiceMock.getGroupLink(GROUP_LINK.id);

        // Assert
        expect(RESULT?.name).not.toBeNull();
        expect(RESULT?.name.length).toBeGreaterThan(0);
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(GROUP_LINK?.id);
    });
});

describe('getGroupLinkList', () => {
    it('Should return a group list of group links', async () => {
        // Arrange
        when(_groupLinkRepositoryMock.getAll()).thenResolve([GROUP_LINK_ENTITY]);
        when(_linkGroupEntityToGroupMapperMock.map(GROUP_LINK_ENTITY)).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await _groupLinkServiceMock.getGroupLinkList();

        // Assert
        expect(RESULT.length).toEqual([GROUP_LINK_ENTITY].length);
        expect(RESULT.at(0)?.id).toEqual(GROUP_LINK?.id);
    });

    it('Should return a empty group list of group links', async () => {
        // Arrange
        when(_groupLinkRepositoryMock.getAll()).thenResolve([]);

        // Act
        const RESULT = await _groupLinkServiceMock.getGroupLinkList();

        // Assert
        expect(RESULT.length).toEqual(0);
    });
});

describe('getPaginateLinkList', () => {
    it('Should return a paginated group list of group links', async () => {
        // Arrange
        const EXPECTED_ITEM_LIST: IGroupLink[] = [GROUP_LINK];
        const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<IGroupLink> = {
            itemList: EXPECTED_ITEM_LIST,
            total: PAGINATE_GROUP_LINK_LIST.total,
            totalPages: PAGINATE_GROUP_LINK_LIST.totalPages,
            currentPage: PAGINATE_GROUP_LINK_LIST.currentPage,
            take: PAGINATE_GROUP_LINK_LIST.take,
        };
        when(_groupLinkRepositoryMock.getAllPaginated(PAGINATE_GROUP_LINK_LIST)).thenResolve({
            itemList: [GROUP_LINK_ENTITY],
            total: PAGINATE_GROUP_LINK_LIST.total,
            totalPages: PAGINATE_GROUP_LINK_LIST.totalPages,
            currentPage: PAGINATE_GROUP_LINK_LIST.currentPage,
            take: PAGINATE_GROUP_LINK_LIST.take,
        });

        // Act
        const RESULT: IPaginateItem<IGroupLink | null> = await _groupLinkServiceMock.getPaginateGroupLinkList(PAGINATE_GROUP_LINK_LIST);

        // Assert
        expect(RESULT.itemList?.length).toEqual(EXPECTED_PAGINATE_LINK_LIST.itemList?.length);
    });

    it('Should return an empty paginated group list when no group links are available', async () => {
        // Arrange
        const EXPECTED_ITEM_LIST: IGroupLink[] = [];
        const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<IGroupLink> = {
            itemList: EXPECTED_ITEM_LIST,
            total: PAGINATE_GROUP_LINK_LIST.total,
            totalPages: PAGINATE_GROUP_LINK_LIST.totalPages,
            currentPage: PAGINATE_GROUP_LINK_LIST.currentPage,
            take: PAGINATE_GROUP_LINK_LIST.take,
        };
        when(_groupLinkRepositoryMock.getAllPaginated(PAGINATE_GROUP_LINK_LIST)).thenResolve({
            itemList: [],
            total: PAGINATE_GROUP_LINK_LIST.total,
            totalPages: PAGINATE_GROUP_LINK_LIST.totalPages,
            currentPage: PAGINATE_GROUP_LINK_LIST.currentPage,
            take: PAGINATE_GROUP_LINK_LIST.take,
        });

        // Act
        const RESULT: IPaginateItem<IGroupLink | null> = await _groupLinkServiceMock.getPaginateGroupLinkList(PAGINATE_GROUP_LINK_LIST);

        // Assert
        expect(RESULT).toEqual(EXPECTED_PAGINATE_LINK_LIST);
    });

    it('Should throw an error when there is an error getting paginated group links', async () => {
        // Arrange
        const ERROR_MESSAGE = GENERIC_TEST_DATA.getMessageError();
        when(_groupLinkRepositoryMock.getAllPaginated(PAGINATE_GROUP_LINK_LIST)).thenReject(new Error(ERROR_MESSAGE));

        // Act & Assert
        await expect(_groupLinkServiceMock.getPaginateGroupLinkList(PAGINATE_GROUP_LINK_LIST)).rejects.toThrowError(ERROR_MESSAGE);
    });

    it('Should return an empty group list when the itemList property of the paginateGroupLinkList parameter is undefined or null', async () => {
        // Act
        const RESULT = await _groupLinkServiceMock.getPaginateGroupLinkList(PAGINATE_GROUP_LINK_LIST);

        // Assert
        expect(RESULT.itemList).toEqual([]);
    });

    it('Should return an empty group list when no group links are available for pagination', async () => {
        // Arrange
        const PAGINATE_GROUP_LINK_LIST_WITH_EMPTY_LIST: IPaginateItem<GroupLinkEntity> = PAGINATE_TEST_DATA.getPaginateWithEmptyList();

        when(_groupLinkRepositoryMock.getAllPaginated(PAGINATE_GROUP_LINK_LIST)).thenResolve(PAGINATE_GROUP_LINK_LIST_WITH_EMPTY_LIST);

        // Act
        const RESULT = await _groupLinkServiceMock.getPaginateGroupLinkList(PAGINATE_GROUP_LINK_LIST);

        // Assert
        expect(RESULT?.itemList?.length ?? 0).toEqual(PAGINATE_GROUP_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
        expect(RESULT.total).toEqual(PAGINATE_GROUP_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
    });
});
