import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkGroupEntityToGroupMapper } from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { IGroup } from '@model/group/group.model';
import { GroupLinkRepository } from '@repository/group-link.repository/group-link.repository';
import { LinkRepository } from '@repository/link.repository/link.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { GroupLinkService } from '@service/group-link.service/group-link.service';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { TokenService } from '@service/middleware/token.service/token.service';
import { GroupLinkServiceTestData } from '@testData/service/group-link.service.test.data';
import { anything, instance, mock, when } from 'ts-mockito';

const GROUP_LINK_SERVICE_TEST_DATA: GroupLinkServiceTestData = new GroupLinkServiceTestData();
// const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();

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
// const LINK_EMPTY_URL_ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkUrl();
const USER_ID = GROUP_LINK_SERVICE_TEST_DATA.getUserId();
const GROUP_LINK: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupLink();
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

    it('Creating a link should return a link entity', async () => {
        // Arrange
        const GROUP_LINK_CREATE: IGroup = GROUP_LINK_SERVICE_TEST_DATA.getGroupCreate();

        when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(groupLinkRepositoryMock.create(anything())).thenCall(async () => {
            return Promise.resolve(GROUP_LINK_ENTITY);
        });
        when(linkGroupEntityToGroupMapper.map(anything())).thenReturn(GROUP_LINK);

        // Act
        const RESULT = await groupLinkServiceMock.createGroupLink(GROUP_LINK_CREATE);

        // Assert
        expect(RESULT?.id).toEqual(GROUP_LINK.id);
    });
});

// describe('updateLink', () => {
//     it('Updating a link with empty name should throw an argument error', async () => {
//         // Arrange
//         const LINK_EMPTY_NAME: ILink = LINK_SERVICE_TEST_DATA.getLinkWithEmptyName();

//         // Act & Assert
//         await expect(linkService.updateLink(LINK_EMPTY_NAME.id, LINK_EMPTY_NAME)).rejects.toThrowError(LINK_EMPTY_NAME_ARGUMENT_ERROR);
//     });

//     it('Updating a link with empty URL should throw an argument error', async () => {
//         // Arrange
//         const LINK_EMPTY_URL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithEmptyUrl();

//         // Act & Assert
//         await expect(linkService.updateLink(LINK_EMPTY_URL.id, LINK_EMPTY_URL)).rejects.toThrow(LINK_EMPTY_URL_ARGUMENT_ERROR);
//     });

//     it('Updating a link with zero ID should throw an argument error', async () => {
//         // Arrange
//         const LINK_ID_IS_ZERO: ILink = LINK_SERVICE_TEST_DATA.getLinkWithZeroId();

//         // Act & Assert
//         await expect(linkService.updateLink(anyNumber(), LINK_ID_IS_ZERO)).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Updating a link with nullish ID should throw an argument error', async () => {
//         // Arrange
//         const LINK_ID_IS_NULL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithNullishId();

//         // Act & Assert
//         await expect(linkService.updateLink(Number(null), LINK_ID_IS_NULL)).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Updating a link should return a link entity', async () => {
//         // Arrange
//         when(linkRepositoryMock.getById(anything())).thenCall(async () => {
//             return Promise.resolve(LINK_ENTITY);
//         });

//         when(linkRepositoryMock.update(anything())).thenCall(async () => {
//             return Promise.resolve(LINK_ENTITY);
//         });

//         when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

//         // Act
//         const RESULT = await linkService.updateLink(LINK.id, LINK);

//         // Assert
//         expect(RESULT.id).toEqual(LINK.id);
//     });

//     it('Updating a link with display order null should return a link entity', async () => {
//         // Arrange
//         const LINK_ENTITY_WITH_DISPLAY_ORDER_NULL: LinkEntity = LINK_SERVICE_TEST_DATA.getLinkEntityWithDisplayOrderNull();

//         when(linkRepositoryMock.getById(anything())).thenCall(async () => {
//             return Promise.resolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
//         });

//         when(linkRepositoryMock.update(anything())).thenCall(async () => {
//             return Promise.resolve(LINK_ENTITY_WITH_DISPLAY_ORDER_NULL);
//         });

//         when(linkRepositoryMock.getNextDisplayOrder(anyNumber(), anyNumber())).thenCall(async () => {
//             return Promise.resolve(LINK_SERVICE_TEST_DATA.getNextDisplayOrder());
//         });

//         when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

//         // Act
//         const RESULT = await linkService.updateLink(LINK.id, LINK);

//         // Assert
//         expect(RESULT.id).toEqual(LINK.id);
//     });
// });

// describe('getLink', () => {
//     it('Getting a link with zero ID should throw an argument error', async () => {
//         // Act & Assert
//         await expect(linkService.deleteLink(anyNumber())).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Getting a link with nullish ID should throw an argument error', async () => {
//         // Act & Assert
//         await expect(linkService.deleteLink(Number(null))).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Should return a list', async () => {
//         // Arrange
//         when(linkRepositoryMock.getById(anyNumber())).thenResolve(LINK_ENTITY);
//         when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

//         // Act
//         const RESULT = await linkService.getLink(LINK_ENTITY.id);

//         // Assert
//         expect(RESULT.id).toEqual(LINK?.id);
//     });
// });

// describe('getLinkList', () => {
//     it('Should return a list of links', async () => {
//         // Arrange
//         when(linkRepositoryMock.getAll()).thenResolve([LINK_ENTITY]);
//         when(linkEntityToLinkMapperMock.map(LINK_ENTITY)).thenReturn(LINK);

//         // Act
//         const RESULT = await linkService.getLinkList();

//         // Assert
//         expect(RESULT).toHaveLength([LINK_ENTITY].length);
//         expect(RESULT.at(0)?.id).toEqual(LINK?.id);
//     });

//     it('Should return a empty list of links', async () => {
//         // Arrange
//         const LINK_ENTITY_EMPTY_LIST: LinkEntity[] = LINK_SERVICE_TEST_DATA.getLinkEntityEmptyList();
//         when(linkRepositoryMock.getAll()).thenResolve(LINK_ENTITY_EMPTY_LIST);

//         // Act
//         const RESULT = await linkService.getLinkList();

//         // Assert
//         expect(RESULT).toHaveLength(LINK_ENTITY_EMPTY_LIST.length);
//         expect(RESULT).toEqual([]);
//     });
// });

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

// describe('deleteLink', () => {
//     const INTERNAL_SERVER_ERROR_DELETE_LINK: InternalServerError = LINK_SERVICE_TEST_DATA.getInternalServerErrorNotDeleteLink(
//         LINK_ENTITY.name
//     );

//     it('Deleting a link with zero ID should throw an argument error', async () => {
//         // Act & Assert
//         await expect(linkService.deleteLink(anyNumber())).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Deleting a link with nullish ID should throw an argument error', async () => {
//         // Act & Assert
//         await expect(linkService.deleteLink(Number(null))).rejects.toThrow(ARGUMENT_ERROR);
//     });

//     it('Should throw error when delete operation fails', async () => {
//         // Arrange
//         when(linkRepositoryMock.delete(LINK_ENTITY.id)).thenReject(INTERNAL_SERVER_ERROR_DELETE_LINK);

//         // Act & Assert
//         await expect(linkService.deleteLink(LINK_ENTITY.id)).rejects.toThrowError(INTERNAL_SERVER_ERROR_DELETE_LINK);
//     });

//     it('Should delete existing link and return true', async () => {
//         // Arrange
//         when(linkRepositoryMock.getById(LINK_ENTITY.id)).thenResolve(LINK_ENTITY);
//         when(linkRepositoryMock.delete(LINK_ENTITY.id)).thenResolve(true);

//         // Act
//         const RESULT: boolean = await linkService.deleteLink(LINK_ENTITY.id);

//         // Assert
//         expect(RESULT).toBe(true);
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
