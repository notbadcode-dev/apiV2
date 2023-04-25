import { LinkEntity } from '@entity/link.entity';
import { InternalServerError } from '@error/internal-server.error';
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
    let linkEntityToLinkMapper: LinkEntityToLinkMapper;
    let tagEntityToTagMapper: TagEntityToTagMapper;
    let linkTagEntityToTagEntityMapper: LinkTagEntityToTagEntityMapper;
    let linkGroupRelationEntityToLinkGroupMapper: LinkGroupRelationEntityToLinkGroupMapper;
    let linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper;

    beforeEach(() => {
        linkRepositoryMock = mock(LinkRepository);
        tokenServiceMock = mock(TokenService);
        globalUtilNumberService = new GlobalUtilNumberService();
        globalUtilValidateService = new GlobalUtilValidateService(globalUtilNumberService);

        tagEntityToTagMapper = new TagEntityToTagMapper();
        linkTagEntityToTagEntityMapper = new LinkTagEntityToTagEntityMapper();
        linkGroupRelationEntityToLinkGroupMapper = new LinkGroupRelationEntityToLinkGroupMapper();
        linkGroupEntityToLinkGroupMapper = new LinkGroupEntityToLinkGroupMapper();

        linkEntityToLinkMapper = new LinkEntityToLinkMapper(
            tagEntityToTagMapper,
            linkTagEntityToTagEntityMapper,
            linkGroupRelationEntityToLinkGroupMapper,
            linkGroupEntityToLinkGroupMapper
        );

        linkService = new LinkService(
            instance(linkRepositoryMock),
            instance(tokenServiceMock),
            globalUtilValidateService,
            linkEntityToLinkMapper
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
            expect(RESULT.at(0)?.id).toEqual(LINK?.id);
        });

        it('Should return a list of links when links are available', async () => {
            // Arrange
            const LINK_ENTITY_ONE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_TWO = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_LIST: LinkEntity[] = [LINK_ENTITY_ONE, LINK_ENTITY_TWO];

            when(linkRepositoryMock.getAll()).thenResolve(LINK_ENTITY_LIST);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.length).toEqual(LINK_ENTITY_LIST.length);
            expect(RESULT.at(0)?.id).toEqual(LINK_ENTITY_ONE.id);
            expect(RESULT.at(1)?.id).toEqual(LINK_ENTITY_TWO.id);
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
            const ERROR_MESSAGE = LINK_SERVICE_TEST_DATA.getMessageError();
            when(linkRepositoryMock.getAll()).thenReject(new Error(ERROR_MESSAGE));

            // Act & Assert
            await expect(linkService.getLinkList()).rejects.toThrowError(ERROR_MESSAGE);
        });

        it('Should return all available links when multiple links are available', async () => {
            // Arrange
            const LINK_ENTITY_ONE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_TWO = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_THREE = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const LINK_ENTITY_LIST: LinkEntity[] = [LINK_ENTITY_ONE, LINK_ENTITY_TWO, LINK_ENTITY_THREE];
            when(linkRepositoryMock.getAll()).thenResolve(LINK_ENTITY_LIST);

            // Act
            const RESULT = await linkService.getLinkList();

            // Assert
            expect(RESULT.length).toEqual(LINK_ENTITY_LIST.length);
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
            const ERROR_MESSAGE = LINK_SERVICE_TEST_DATA.getMessageError();
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
            const PAGINATE_LINK_LIST_WITH_EMPTY_LIST: IPaginateItem<LinkEntity> =
                LINK_SERVICE_TEST_DATA.getSimplePaginateEntityLinkListWithEmptyList();

            when(linkRepositoryMock.getAllPaginated(PAGINATE_LINK_LIST)).thenResolve(PAGINATE_LINK_LIST_WITH_EMPTY_LIST);

            // Act
            const RESULT = await linkService.getPaginateLinkList(PAGINATE_LINK_LIST);

            // Assert
            expect(RESULT?.itemList?.length ?? 0).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
            expect(RESULT.total).toEqual(PAGINATE_LINK_LIST_WITH_EMPTY_LIST.itemList?.length);
        });
    });

    describe('changeActive', () => {
        it('Changing a link active status to true should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const NEW_LINK_ACTIVE = true;

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, NEW_LINK_ACTIVE);

            // Assert
            expect(RESULT.active).toBe(NEW_LINK_ACTIVE);
        });

        it('Changing a link active status to false should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getInactiveLinkEntity();
            const NEW_LINK_ACTIVE = false;

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, NEW_LINK_ACTIVE);

            // Assert
            expect(RESULT.active).toBe(NEW_LINK_ACTIVE);
        });
    });

    describe('changeFavorite', () => {
        it('Changing a link favorite status to true should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getFavoriteLinkEntity();
            const NEW_LINK_FAVORITE = true;

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, NEW_LINK_FAVORITE);

            // Assert
            expect(RESULT.favorite).toBe(NEW_LINK_FAVORITE);
        });

        it('Changing a link favorite status to false should return the updated link', async () => {
            // Arrange
            const LINK = LINK_SERVICE_TEST_DATA.getLink();
            const LINK_ENTITY = LINK_SERVICE_TEST_DATA.getLinkEntity();
            const NEW_LINK_FAVORITE = false;

            when(linkRepositoryMock.getById(anyNumber())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(LINK_ENTITY);
            });

            // Act
            const RESULT = await linkService.changeActiveLink(LINK.id, NEW_LINK_FAVORITE);

            // Assert
            expect(RESULT.favorite).toBe(NEW_LINK_FAVORITE);
        });
    });

    describe('deleteLink', () => {
        const DELETE_LINK_ENTITY: LinkEntity = LINK_SERVICE_TEST_DATA.getLinkEntity();
        const INTERNAL_SERVER_ERROR_DELETE_LINK: InternalServerError = LINK_SERVICE_TEST_DATA.getInternalServerErrorNotDeleteLink(
            DELETE_LINK_ENTITY.name
        );

        it('Should delete existing link and return true', async () => {
            // Arrange
            when(linkRepositoryMock.getById(DELETE_LINK_ENTITY.id)).thenResolve(DELETE_LINK_ENTITY);
            when(linkRepositoryMock.delete(DELETE_LINK_ENTITY.id)).thenResolve(true);

            // Act
            const RESULT: boolean = await linkService.deleteLink(DELETE_LINK_ENTITY.id);

            // Assert
            expect(RESULT).toBe(true);
        });

        it('Should throw error when delete operation fails', async () => {
            // Arrange
            when(linkRepositoryMock.delete(DELETE_LINK_ENTITY.id)).thenReject(INTERNAL_SERVER_ERROR_DELETE_LINK);

            // Act & Assert
            await expect(linkService.deleteLink(DELETE_LINK_ENTITY.id)).rejects.toThrowError(INTERNAL_SERVER_ERROR_DELETE_LINK);
        });
    });
});
