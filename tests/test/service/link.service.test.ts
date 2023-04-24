import { LinkEntity } from '@entity/link.entity';
import { LinkGroupRelationEntityToLinkGroupMapper } from '@mapper/link-group-relation/linkGroupRelationEntityToLinkGroup.mapper';
import { LinkGroupEntityToLinkGroupMapper } from '@mapper/link-group/linkGroupEntityToLinkGroup.mapper';
import { LinkTagEntityToTagEntityMapper } from '@mapper/link-tag/linkTagEntityToTagEntity.mapper';
import { LinkEntityToLinkMapper } from '@mapper/link/linkEntityToLink.mapper';
import { TagEntityToTagMapper } from '@mapper/tag/tagEntityToTag.mapper';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LinkRepository } from '@repository/link.repository';
import { GlobalUtilNumberService } from '@service/global/global.util.number.service';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { LinkService } from '@service/link.service';
import { TokenService } from '@service/token.service';
import { LinkServiceTestData } from '@testData/service/link.service.test.data';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

describe('LinkService', () => {
    const LINK_SERVICE_TEST_DATA: LinkServiceTestData = new LinkServiceTestData();

    let linkRepositoryMock: LinkRepository;
    let tokenServiceMock: TokenService;
    let globalUtilNumberService: GlobalUtilNumberService;
    let globalUtilValidateService: GlobalUtilValidateService;
    let linkService: LinkService;
    let linkEntityToLinkMapperMock: LinkEntityToLinkMapper;
    let tagEntityToTagMapperMock: TagEntityToTagMapper;
    let linkTagEntityToTagEntityMapper: LinkTagEntityToTagEntityMapper;
    let linkGroupRelationEntityToLinkGroupMapper: LinkGroupRelationEntityToLinkGroupMapper;
    let linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper;

    beforeEach(() => {
        linkRepositoryMock = mock(LinkRepository);
        tokenServiceMock = mock(TokenService);
        globalUtilNumberService = new GlobalUtilNumberService();
        globalUtilValidateService = new GlobalUtilValidateService(globalUtilNumberService);

        tagEntityToTagMapperMock = new TagEntityToTagMapper();
        linkTagEntityToTagEntityMapper = new LinkTagEntityToTagEntityMapper();
        linkGroupRelationEntityToLinkGroupMapper = new LinkGroupRelationEntityToLinkGroupMapper();
        linkGroupEntityToLinkGroupMapper = new LinkGroupEntityToLinkGroupMapper();

        linkEntityToLinkMapperMock = new LinkEntityToLinkMapper(
            tagEntityToTagMapperMock,
            linkTagEntityToTagEntityMapper,
            linkGroupRelationEntityToLinkGroupMapper,
            linkGroupEntityToLinkGroupMapper
        );

        linkService = new LinkService(
            instance(linkRepositoryMock),
            instance(tokenServiceMock),
            globalUtilValidateService,
            linkEntityToLinkMapperMock
        );
    });

    describe('createLink', () => {
        it('Creating a link with empty name should throw an argument error', async () => {
            // Arrange
            const LINK_CREATE_EMPTY_NAME = LINK_SERVICE_TEST_DATA.getLinkCreateWithEmptyName();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.createLink(LINK_CREATE_EMPTY_NAME)).rejects.toThrowError(ARGUMENT_ERROR);
        });

        it('Creating a link with empty URL should throw an argument error', async () => {
            // Arrange
            const LINK_CREATE_EMPTY_URL = LINK_SERVICE_TEST_DATA.getLinkCreateWithEmptyUrl();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.createLink(LINK_CREATE_EMPTY_URL)).rejects.toThrow(ARGUMENT_ERROR);
        });

        it('Creating a link should return a link entity', async () => {
            // Arrange
            const LINK_CREATE = LINK_SERVICE_TEST_DATA.getLinkCreate();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const USER_ID = LINK_SERVICE_TEST_DATA.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.createLink(LINK_CREATE);

            // Assert
            expect(RESULT.id).toEqual(LINK.id);
        });
    });

    describe('updateLink', () => {
        it('Updating a link with empty name should throw an argument error', async () => {
            // Arrange
            const LINK_EMPTY_NAME = LINK_SERVICE_TEST_DATA.getLinkWithEmptyName();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.updateLink(LINK_EMPTY_NAME.id, LINK_EMPTY_NAME)).rejects.toThrowError(ARGUMENT_ERROR);
        });

        it('Updating a link with empty URL should throw an argument error', async () => {
            // Arrange
            const LINK_EMPTY_URL = LINK_SERVICE_TEST_DATA.getLinkWithEmptyUrl();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.updateLink(LINK_EMPTY_URL.id, LINK_EMPTY_URL)).rejects.toThrow(ARGUMENT_ERROR);
        });

        it('Updating a link with zero ID should throw an argument error', async () => {
            // Arrange
            const LINK_ID_IS_ZERO = LINK_SERVICE_TEST_DATA.getLinkWithZeroId();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(anyNumber(), LINK_ID_IS_ZERO)).rejects.toThrow(ARGUMENT_ERROR);
        });

        it('Updating a link with nullish ID should throw an argument error', async () => {
            // Arrange
            const LINK_ID_IS_NULL = LINK_SERVICE_TEST_DATA.getLinkWithNullishId();
            const ARGUMENT_ERROR = LINK_SERVICE_TEST_DATA.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(Number(null), LINK_ID_IS_NULL)).rejects.toThrow(ARGUMENT_ERROR);
        });

        it('Updating a link with wrong ID parameter should throw an internal server error', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ALTERNATIVE = LINK_SERVICE_TEST_DATA.getLinkAlternative();
            const INTERNAL_SERVER_ERROR = LINK_SERVICE_TEST_DATA.getInternalServerErrorNotMatchParamAndBodyId();

            // Act & Assert
            await expect(linkService.updateLink(LINK.id, LINK_ALTERNATIVE)).rejects.toThrow(INTERNAL_SERVER_ERROR);
        });

        it('Updating a link should return a link entity', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const USER_ID = LINK_SERVICE_TEST_DATA.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.updateLink(LINK.id, LINK);

            // Assert
            expect(RESULT.id).toEqual(LINK.id);
        });
    });

    describe('getLinkList', () => {
        it('Should return a list of links', async () => {
            // Arrange
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            when(linkRepositoryMock.getAll()).thenResolve([LINK_ENTITY]);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.at(0)?.id).toEqual([LINK].at(0)?.id);
        });

        it('Should return a list of links when links are available', async () => {
            // Arrange
            const LINK_ENTITY_ONE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_TWO = LINK_SERVICE_TEST_DATA.getLinkEntity();
            when(linkRepositoryMock.getAll()).thenResolve([LINK_ENTITY_ONE, LINK_ENTITY_TWO]);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.length).toEqual(2);
            expect(RESULT[0].id).toEqual(LINK_ENTITY_ONE.id);
            expect(RESULT[1].id).toEqual(LINK_ENTITY_TWO.id);
        });

        it('Should return an empty list when no links are available', async () => {
            // Arrange
            when(linkRepositoryMock.getAll()).thenResolve([]);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.length).toEqual(0);
        });

        it('Should throw an error when there is an error getting links', async () => {
            // Arrange
            const ERROR_MESSAGE = 'Error getting links';
            when(linkRepositoryMock.getAll()).thenReject(new Error(ERROR_MESSAGE));

            // Act & Assert
            await expect(linkService.getLinkList()).rejects.toThrowError(ERROR_MESSAGE);
        });

        it('Should return all available links when multiple links are available', async () => {
            // Arrange
            const LINK_ENTITY_ONE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_TWO = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_THREE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            when(linkRepositoryMock.getAll()).thenResolve([LINK_ENTITY_ONE, LINK_ENTITY_TWO, LINK_ENTITY_THREE]);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.length).toEqual(3);
            expect(RESULT.some((link) => link.id === LINK_ENTITY_ONE.id)).toBeTruthy();
            expect(RESULT.some((link) => link.id === LINK_ENTITY_TWO.id)).toBeTruthy();
            expect(RESULT.some((link) => link.id === LINK_ENTITY_THREE.id)).toBeTruthy();
        });
    });

    describe('getPaginateLinkList', () => {
        it('Should return a paginated list of links', async () => {
            // Arrange
            const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getPaginateLinkList();
            const LINK_ENTITY: LinkEntity = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK: ILink = LINK_SERVICE_TEST_DATA.getLink();
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
            const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getPaginateLinkList();
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
            const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getPaginateLinkList();
            const ERROR_MESSAGE = 'Error getting paginated links';
            when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenReject(new Error(ERROR_MESSAGE));

            // Act & Assert
            await expect(linkService.getPaginateLinkList(PAGINATE_LINK_LIST)).rejects.toThrowError(ERROR_MESSAGE);
        });

        it('Should return an empty list when the itemList property of the paginateLinkList parameter is undefined or null', async () => {
            // Arrange
            const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getSimpleWithUndefinedItemListPaginateLinkList();

            // Act
            const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

            // Assert
            expect(RESULT.itemList).toEqual([]);
        });

        it('Should return an empty list when no links are available for pagination', async () => {
            // Arrange
            const PAGINATE_LINK_LIST: IPaginateItem<ILink> = LINK_SERVICE_TEST_DATA.getSimplePaginateLinkList();

            when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve({
                itemList: [],
                total: 0,
                take: 10,
            });

            // Act
            const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

            // Assert
            expect(RESULT?.itemList?.length ?? 0).toEqual(0);
            expect(RESULT.total).toEqual(0);
        });
    });

    describe('changeActive', () => {
        it('Changing a link active status to true should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, true);

            // Assert
            expect(RESULT.active).toBe(true);
        });

        it('Changing a link active status to false should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getInactiveLinkEntity();

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, true);

            // Assert
            expect(RESULT.active).toBe(false);
        });
    });

    describe('changeFavorite', () => {
        it('Changing a link favorite status to true should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getFavoriteLinkEntity();

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, true);

            // Assert
            expect(RESULT.favorite).toBe(true);
        });

        it('Changing a link favorite status to false should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, true);

            // Assert
            expect(RESULT.favorite).toBe(false);
        });
    });
});
