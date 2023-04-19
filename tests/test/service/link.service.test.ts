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
    const linkServiceTestData: LinkServiceTestData = new LinkServiceTestData();

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
            const linkCreateEmptyName = linkServiceTestData.getLinkCreateWithEmptyName();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.createLink(linkCreateEmptyName)).rejects.toThrowError(argumentError);
        });

        it('Creating a link with empty URL should throw an argument error', async () => {
            // Arrange
            const linkCreateEmptyUrl = linkServiceTestData.getLinkCreateWithEmptyUrl();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.createLink(linkCreateEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('Creating a link should return a link entity', async () => {
            // Arrange
            const linkCreate = linkServiceTestData.getLinkCreate();
            const linkEntity = linkServiceTestData.getLinkEntity();
            const link = linkServiceTestData.getLink();
            const userId = linkServiceTestData.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(userId);
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(linkEntity);
            });

            // Act
            const result = await linkService.createLink(linkCreate);

            // Assert
            expect(result.id).toEqual(link.id);
        });
    });

    describe('updateLink', () => {
        it('Updating a link with empty name should throw an argument error', async () => {
            // Arrange
            const linkEmptyName = linkServiceTestData.getLinkWithEmptyName();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.updateLink(linkEmptyName.id, linkEmptyName)).rejects.toThrowError(argumentError);
        });

        it('Updating a link with empty URL should throw an argument error', async () => {
            // Arrange
            const linkEmptyUrl = linkServiceTestData.getLinkWithEmptyUrl();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.updateLink(linkEmptyUrl.id, linkEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('Updating a link with zero ID should throw an argument error', async () => {
            // Arrange
            const linkIdIsZero = linkServiceTestData.getLinkWithZeroId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(anyNumber(), linkIdIsZero)).rejects.toThrow(argumentError);
        });

        it('Updating a link with nullish ID should throw an argument error', async () => {
            // Arrange
            const linkIdIsNull = linkServiceTestData.getLinkWithNullishId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(Number(null), linkIdIsNull)).rejects.toThrow(argumentError);
        });

        it('Updating a link with wrong ID parameter should throw an internal server error', async () => {
            // Arrange
            const link = linkServiceTestData.getLink();
            const linkAlternative = linkServiceTestData.getLinkAlternative();
            const internalServerError = linkServiceTestData.getInternalServerErrorNotMatchParamAndBodyId();

            // Act & Assert
            await expect(linkService.updateLink(link.id, linkAlternative)).rejects.toThrow(internalServerError);
        });

        it('Updating a link should return a link entity', async () => {
            // Arrange
            const link = linkServiceTestData.getLink();
            const linkEntity = linkServiceTestData.getLinkEntity();
            const userId = linkServiceTestData.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(userId);
            when(linkRepositoryMock.update(anything())).thenCall(async () => {
                return Promise.resolve(linkEntity);
            });
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(linkEntity);
            });

            // Act
            const result = await linkService.updateLink(link.id, link);

            // Assert
            expect(result.id).toEqual(link.id);
        });
    });

    describe('getLinkList', () => {
        it('Should return a list of links', async () => {
            // Arrange
            const linkEntity = linkServiceTestData.getLinkEntity();
            const link = linkServiceTestData.getLink();
            when(linkRepositoryMock.getAll()).thenResolve([linkEntity]);

            // Act
            const result = await linkService.getLinkList();

            // Assert
            expect(result.at(0)?.id).toEqual([link].at(0)?.id);
        });

        it('Should return a list of links when links are available', async () => {
            // Arrange
            const linkEntity1 = linkServiceTestData.getLinkEntity();
            const linkEntity2 = linkServiceTestData.getLinkEntity();
            when(linkRepositoryMock.getAll()).thenResolve([linkEntity1, linkEntity2]);

            // Act
            const result = await linkService.getLinkList();

            // Assert
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(linkEntity1.id);
            expect(result[1].id).toEqual(linkEntity2.id);
        });

        it('Should return an empty list when no links are available', async () => {
            // Arrange
            when(linkRepositoryMock.getAll()).thenResolve([]);

            // Act
            const result = await linkService.getLinkList();

            // Assert
            expect(result.length).toEqual(0);
        });

        it('Should throw an error when there is an error getting links', async () => {
            // Arrange
            const errorMessage = 'Error getting links';
            when(linkRepositoryMock.getAll()).thenReject(new Error(errorMessage));

            // Act & Assert
            await expect(linkService.getLinkList()).rejects.toThrowError(errorMessage);
        });

        it('Should return all available links when multiple links are available', async () => {
            // Arrange
            const linkEntity1 = linkServiceTestData.getLinkEntity();
            const linkEntity2 = linkServiceTestData.getLinkEntity();
            const linkEntity3 = linkServiceTestData.getLinkEntity();
            when(linkRepositoryMock.getAll()).thenResolve([linkEntity1, linkEntity2, linkEntity3]);

            // Act
            const result = await linkService.getLinkList();

            // Assert
            expect(result.length).toEqual(3);
            expect(result.some((link) => link.id === linkEntity1.id)).toBeTruthy();
            expect(result.some((link) => link.id === linkEntity2.id)).toBeTruthy();
            expect(result.some((link) => link.id === linkEntity3.id)).toBeTruthy();
        });
    });

    describe('getPaginateLinkList', () => {
        it('Should return a paginated list of links', async () => {
            // Arrange
            const paginateLinkList: IPaginateItem<ILink> = linkServiceTestData.getPaginateLinkList();
            const linkEntity: LinkEntity = linkServiceTestData.getLinkEntity();
            const link: ILink = linkServiceTestData.getLink();
            const expectedItemList: ILink[] = [link];
            const expectedPaginateLinkList: IPaginateItem<ILink> = {
                itemList: expectedItemList,
                total: paginateLinkList.total,
                totalPages: paginateLinkList.totalPages,
                currentPage: paginateLinkList.currentPage,
                take: paginateLinkList.take,
            };
            when(linkRepositoryMock.getAllPaginated(paginateLinkList)).thenResolve({
                itemList: [linkEntity],
                total: paginateLinkList.total,
                totalPages: paginateLinkList.totalPages,
                currentPage: paginateLinkList.currentPage,
                take: paginateLinkList.take,
            });

            // Act
            const result: IPaginateItem<ILink> = await linkService.getPaginateLinkList(paginateLinkList);

            // Assert
            expect(result.itemList?.length).toEqual(expectedPaginateLinkList.itemList?.length);
        });

        it('Should return an empty paginated list when no links are available', async () => {
            // Arrange
            const paginateLinkList: IPaginateItem<ILink> = linkServiceTestData.getPaginateLinkList();
            const expectedItemList: ILink[] = [];
            const expectedPaginateLinkList: IPaginateItem<ILink> = {
                itemList: expectedItemList,
                total: paginateLinkList.total,
                totalPages: paginateLinkList.totalPages,
                currentPage: paginateLinkList.currentPage,
                take: paginateLinkList.take,
            };
            when(linkRepositoryMock.getAllPaginated(paginateLinkList)).thenResolve({
                itemList: [],
                total: paginateLinkList.total,
                totalPages: paginateLinkList.totalPages,
                currentPage: paginateLinkList.currentPage,
                take: paginateLinkList.take,
            });

            // Act
            const result: IPaginateItem<ILink> = await linkService.getPaginateLinkList(paginateLinkList);

            // Assert
            expect(result).toEqual(expectedPaginateLinkList);
        });

        it('Should throw an error when there is an error getting paginated links', async () => {
            // Arrange
            const paginateLinkList: IPaginateItem<ILink> = linkServiceTestData.getPaginateLinkList();
            const errorMessage = 'Error getting paginated links';
            when(linkRepositoryMock.getAllPaginated(paginateLinkList)).thenReject(new Error(errorMessage));

            // Act & Assert
            await expect(linkService.getPaginateLinkList(paginateLinkList)).rejects.toThrowError(errorMessage);
        });

        it('Should return an empty list when the itemList property of the paginateLinkList parameter is undefined or null', async () => {
            // Arrange
            const paginateLinkList: IPaginateItem<ILink> = { total: 0, itemList: undefined, take: 10 };

            // Act
            const result = await linkService.getPaginateLinkList(paginateLinkList);

            // Assert
            expect(result.itemList).toEqual([]);
        });

        it('Should return an empty list when no links are available for pagination', async () => {
            // Arrange
            const paginateLinkList: IPaginateItem<ILink> = {
                totalPages: 1,
                currentPage: 10,
                take: 10,
            };

            when(linkRepositoryMock.getAllPaginated(paginateLinkList)).thenResolve({
                itemList: [],
                total: 0,
                take: 10,
            });

            // Act
            const result = await linkService.getPaginateLinkList(paginateLinkList);

            // Assert
            expect(result?.itemList?.length ?? 0).toEqual(0);
            expect(result.total).toEqual(0);
        });
    });
});
