import { LinkEntityToLinkMapper } from '@app/linkApi/infrastructure/mapper/link/linkEntityToLink.mapper';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LinkRepository } from '@repository/link.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service/global.util.validate.service';
import { LinkService } from '@service/link.service/link.service';
import { ILinkService } from '@service/link.service/link.service.interface';
import { TokenService } from '@service/middleware/token.service/token.service';
import { LinkServiceTestData } from '@testData/service/link.service.test.data';
import { PaginateTestData } from '@testData/service/paginate.test.data';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

const LINK_SERVICE_TEST_DATA: LinkServiceTestData = new LinkServiceTestData();
const PAGINATE_TEST_DATA: PaginateTestData = new PaginateTestData();

let linkService: ILinkService;
let tokenServiceMock: TokenService;
let linkRepositoryMock: LinkRepository;
let globalUtilValidateServiceMock: GlobalUtilValidateService;
let linkEntityToLinkMapperMock: LinkEntityToLinkMapper;

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    generateLinkService();
});

const LINK_EMPTY_NAME_ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkName();
const LINK_EMPTY_URL_ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkUrl();
const USER_ID = LINK_SERVICE_TEST_DATA.getUserId();
const LINK: ILink = LINK_SERVICE_TEST_DATA.getLink();
const LINK_ENTITY: LinkEntity = LINK_SERVICE_TEST_DATA.getLinkEntity();
const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getPaginateLinkList();
const ARGUMENT_ERROR: ArgumentError = LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();

describe('createLink', () => {
    it('Creating a link with empty name should throw an argument error', async () => {
        // Arrange
        const LINK_CREATE_EMPTY_NAME: ILinkCreate = LINK_SERVICE_TEST_DATA.getLinkCreateWithEmptyName();

        // Act & Assert
        await expect(linkService.createLink(LINK_CREATE_EMPTY_NAME)).rejects.toThrowError(LINK_EMPTY_NAME_ARGUMENT_ERROR);
    });

    it('Creating a link with empty URL should throw an argument error', async () => {
        // Arrange
        const LINK_CREATE_EMPTY_URL: ILinkCreate = LINK_SERVICE_TEST_DATA.getLinkCreateWithEmptyUrl();

        // Act & Assert
        await expect(linkService.createLink(LINK_CREATE_EMPTY_URL)).rejects.toThrow(LINK_EMPTY_URL_ARGUMENT_ERROR);
    });

    it('Creating a link should return a link entity', async () => {
        // Arrange
        const LINK_CREATE: ILinkCreate = LINK_SERVICE_TEST_DATA.getLinkCreate();

        when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(linkRepositoryMock.create(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });
        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.createLink(LINK_CREATE);

        // Assert
        expect(RESULT.id).toEqual(LINK.id);
    });
});

describe('updateLink', () => {
    it('Updating a link with empty name should throw an argument error', async () => {
        // Arrange
        const LINK_EMPTY_NAME: ILink = LINK_SERVICE_TEST_DATA.getLinkWithEmptyName();

        // Act & Assert
        await expect(linkService.updateLink(LINK_EMPTY_NAME.id, LINK_EMPTY_NAME)).rejects.toThrowError(LINK_EMPTY_NAME_ARGUMENT_ERROR);
    });

    it('Updating a link with empty URL should throw an argument error', async () => {
        // Arrange
        const LINK_EMPTY_URL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithEmptyUrl();

        // Act & Assert
        await expect(linkService.updateLink(LINK_EMPTY_URL.id, LINK_EMPTY_URL)).rejects.toThrow(LINK_EMPTY_URL_ARGUMENT_ERROR);
    });

    it('Updating a link with zero ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_ZERO: ILink = LINK_SERVICE_TEST_DATA.getLinkWithZeroId();

        // Act & Assert
        await expect(linkService.updateLink(anyNumber(), LINK_ID_IS_ZERO)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Updating a link with nullish ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_NULL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithNullishId();

        // Act & Assert
        await expect(linkService.updateLink(Number(null), LINK_ID_IS_NULL)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Updating a link should return a link entity', async () => {
        // Arrange
        when(linkRepositoryMock.update(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.updateLink(LINK.id, LINK);

        // Assert
        expect(RESULT.id).toEqual(LINK.id);
    });
});

describe('getLink', () => {
    it('Getting a link with zero ID should throw an argument error', async () => {
        // Act & Assert
        await expect(linkService.deleteLink(anyNumber())).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Getting a link with nullish ID should throw an argument error', async () => {
        // Act & Assert
        await expect(linkService.deleteLink(Number(null))).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Should return a list', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenResolve(LINK_ENTITY);
        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.getLink(LINK_ENTITY.id);

        // Assert
        expect(RESULT.id).toEqual(LINK?.id);
    });
});

describe('getLinkList', () => {
    it('Should return a list of links', async () => {
        // Arrange
        when(linkRepositoryMock.getAll()).thenResolve([LINK_ENTITY]);
        when(linkEntityToLinkMapperMock.map(LINK_ENTITY)).thenReturn(LINK);

        // Act
        const RESULT = await linkService.getLinkList();

        // Assert
        expect(RESULT).toHaveLength([LINK_ENTITY].length);
        expect(RESULT.at(0)?.id).toEqual(LINK?.id);
    });

    it('Should return a empty list of links', async () => {
        // Arrange
        const LINK_ENTITY_EMPTY_LIST: LinkEntity[] = LINK_SERVICE_TEST_DATA.getLinkEntityEmptyList();
        when(linkRepositoryMock.getAll()).thenResolve(LINK_ENTITY_EMPTY_LIST);

        // Act
        const RESULT = await linkService.getLinkList();

        // Assert
        expect(RESULT).toHaveLength(LINK_ENTITY_EMPTY_LIST.length);
        expect(RESULT).toEqual([]);
    });
});

describe('getPaginateLinkList', () => {
    it('Should return a paginated list of links', async () => {
        // Arrange
        const EXPECTED_ITEM_LIST: ILink[] = [LINK];
        const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
            itemList: EXPECTED_ITEM_LIST,
            total: PAGINATE_LINK_LIST.total,
            totalPages: PAGINATE_LINK_LIST.totalPages,
            currentPage: PAGINATE_LINK_LIST.currentPage,
            take: PAGINATE_LINK_LIST.take,
        };
        when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve({
            itemList: [LINK_ENTITY],
            total: PAGINATE_LINK_LIST.total,
            totalPages: PAGINATE_LINK_LIST.totalPages,
            currentPage: PAGINATE_LINK_LIST.currentPage,
            take: PAGINATE_LINK_LIST.take,
        });

        // Act
        const RESULT: IPaginateItem<ILink> = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

        // Assert
        expect(RESULT.itemList?.length).toEqual(EXPECTED_PAGINATE_LINK_LIST.itemList?.length);
    });

    it('Should return an empty paginated list when no links are available', async () => {
        // Arrange
        const EXPECTED_ITEM_LIST: ILink[] = [];
        const EXPECTED_PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
            itemList: EXPECTED_ITEM_LIST,
            total: PAGINATE_LINK_LIST.total,
            totalPages: PAGINATE_LINK_LIST.totalPages,
            currentPage: PAGINATE_LINK_LIST.currentPage,
            take: PAGINATE_LINK_LIST.take,
        };
        when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve({
            itemList: [],
            total: PAGINATE_LINK_LIST.total,
            totalPages: PAGINATE_LINK_LIST.totalPages,
            currentPage: PAGINATE_LINK_LIST.currentPage,
            take: PAGINATE_LINK_LIST.take,
        });

        // Act
        const RESULT: IPaginateItem<ILink> = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

        // Assert
        expect(RESULT).toEqual(EXPECTED_PAGINATE_LINK_LIST);
    });

    it('Should throw an error when there is an error getting paginated links', async () => {
        // Arrange
        const ERROR_MESSAGE = LINK_SERVICE_TEST_DATA.getMessageError();
        when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenReject(new Error(ERROR_MESSAGE));

        // Act & Assert
        await expect(linkService.getPaginateLinkList(PAGINATE_LINK_LIST)).rejects.toThrowError(ERROR_MESSAGE);
    });

    it('Should return an empty list when the itemList property of the paginateLinkList parameter is undefined or null', async () => {
        // Act
        const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

        // Assert
        expect(RESULT.itemList).toEqual([]);
    });

    it('Should return an empty list when no links are available for pagination', async () => {
        // Arrange
        const PAGINATE_LINK_LIST_WITH_EMPTY_LIST: IPaginateItem<LinkEntity> = PAGINATE_TEST_DATA.getPaginateWithEmptyList();

        when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve(PAGINATE_LINK_LIST_WITH_EMPTY_LIST);

        // Act
        const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

        // Assert
        expect(RESULT?.itemList?.length ?? 0).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
        expect(RESULT.total).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
    });
});

describe('changeActive', () => {
    const LINK_INACTIVE: ILink = LINK_SERVICE_TEST_DATA.getLinkWithInactive();
    const LINK_IS_ACTIVE = true;
    const LINK_IS_INACTIVE = false;

    it('Changing a link active with zero ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_ZERO: ILink = LINK_SERVICE_TEST_DATA.getLinkWithZeroId();

        // Act & Assert
        await expect(linkService.changeActiveLink(LINK_ID_IS_ZERO.id, true)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Changing a link active with nullish ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_NULL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithNullishId();

        // Act & Assert
        await expect(linkService.changeActiveLink(LINK_ID_IS_NULL.id, true)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Changing a link active status from false to true should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_INACTIVE);

        when(linkRepositoryMock.update(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_INACTIVE);

        // Act
        const RESULT = await linkService.changeActiveLink(LINK_INACTIVE.id, LINK_IS_ACTIVE);

        // Assert
        expect(RESULT.active).toBe(LINK_IS_ACTIVE);
    });

    it('Changing a link active status from true to true should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.changeActiveLink(LINK.id, LINK_IS_ACTIVE);

        // Assert
        expect(RESULT.active).toBe(LINK_IS_ACTIVE);
    });

    it('Changing a link active status from true to false should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        when(linkRepositoryMock.update(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_INACTIVE);

        // Act
        const RESULT = await linkService.changeActiveLink(LINK.id, LINK_IS_INACTIVE);

        // Assert
        expect(RESULT.active).toBe(LINK_IS_INACTIVE);
    });

    it('Changing a link active status from false to false should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_INACTIVE);

        // Act
        const RESULT = await linkService.changeActiveLink(LINK.id, LINK_IS_INACTIVE);

        // Assert
        expect(RESULT.active).toBe(LINK_IS_INACTIVE);
    });
});
describe('changeFavorite', () => {
    const LINK_UNFAVORITE: ILink = LINK_SERVICE_TEST_DATA.getLinkWithUnfavorite();
    const LINK_IS_FAVORITE = true;
    const LINK_IS_UNFAVORITE = false;

    it('Changing a link favorite with zero ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_ZERO: ILink = LINK_SERVICE_TEST_DATA.getLinkWithZeroId();

        // Act & Assert
        await expect(linkService.changeFavoriteLink(LINK_ID_IS_ZERO.id, true)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Changing a link favorite with nullish ID should throw an argument error', async () => {
        // Arrange
        const LINK_ID_IS_NULL: ILink = LINK_SERVICE_TEST_DATA.getLinkWithNullishId();

        // Act & Assert
        await expect(linkService.changeFavoriteLink(LINK_ID_IS_NULL.id, true)).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Changing a link favorite status from false to true should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_UNFAVORITE);

        when(linkRepositoryMock.update(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.changeFavoriteLink(LINK.id, LINK_IS_FAVORITE);

        // Assert
        expect(RESULT.favorite).toBe(LINK_IS_FAVORITE);
    });

    it('Changing a link favorite status from true to true should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.changeFavoriteLink(LINK.id, LINK_IS_FAVORITE);

        // Assert
        expect(RESULT.favorite).toBe(LINK_IS_FAVORITE);
    });

    it('Changing a link favorite status from true to false should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        when(linkRepositoryMock.update(anything())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK);

        // Act
        const RESULT = await linkService.changeFavoriteLink(LINK.id, LINK_IS_UNFAVORITE);

        // Assert
        expect(RESULT.favorite).toBe(LINK_IS_UNFAVORITE);
    });

    it('Changing a link favorite status from false to false should return the updated link', async () => {
        // Arrange
        when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
            return Promise.resolve(LINK_ENTITY);
        });

        when(linkEntityToLinkMapperMock.map(anything())).thenReturn(LINK_UNFAVORITE);

        // Act
        const RESULT = await linkService.changeFavoriteLink(LINK.id, LINK_IS_UNFAVORITE);

        // Assert
        expect(RESULT.favorite).toBe(LINK_IS_UNFAVORITE);
    });
});

describe('deleteLink', () => {
    const INTERNAL_SERVER_ERROR_DELETE_LINK: InternalServerError = LINK_SERVICE_TEST_DATA.getInternalServerErrorNotDeleteLink(
        LINK_ENTITY.name
    );

    it('Deleting a link with zero ID should throw an argument error', async () => {
        // Act & Assert
        await expect(linkService.deleteLink(anyNumber())).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Deleting a link with nullish ID should throw an argument error', async () => {
        // Act & Assert
        await expect(linkService.deleteLink(Number(null))).rejects.toThrow(ARGUMENT_ERROR);
    });

    it('Should throw error when delete operation fails', async () => {
        // Arrange
        when(linkRepositoryMock.delete(LINK_ENTITY.id)).thenReject(INTERNAL_SERVER_ERROR_DELETE_LINK);

        // Act & Assert
        await expect(linkService.deleteLink(LINK_ENTITY.id)).rejects.toThrowError(INTERNAL_SERVER_ERROR_DELETE_LINK);
    });

    it('Should delete existing link and return true', async () => {
        // Arrange
        when(linkRepositoryMock.getById(LINK_ENTITY.id)).thenResolve(LINK_ENTITY);
        when(linkRepositoryMock.delete(LINK_ENTITY.id)).thenResolve(true);

        // Act
        const RESULT: boolean = await linkService.deleteLink(LINK_ENTITY.id);

        // Assert
        expect(RESULT).toBe(true);
    });
});

function generateLinkService(): void {
    tokenServiceMock = mock(TokenService);
    linkRepositoryMock = mock(LinkRepository);
    globalUtilValidateServiceMock = mock(GlobalUtilValidateService);
    linkEntityToLinkMapperMock = mock(LinkEntityToLinkMapper);

    linkService = new LinkService(
        instance(linkRepositoryMock),
        instance(tokenServiceMock),
        instance(globalUtilValidateServiceMock),
        instance(linkEntityToLinkMapperMock)
    );
}
