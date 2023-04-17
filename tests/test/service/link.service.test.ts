import { LinkEntityToLinkMapper } from '@mapper/link/linkEntityToLink.mapper';
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
    let linkEntityToLinkMapper: LinkEntityToLinkMapper;
    let linkService: LinkService;

    beforeEach(() => {
        linkRepositoryMock = mock(LinkRepository);
        tokenServiceMock = mock(TokenService);
        globalUtilNumberService = new GlobalUtilNumberService();
        globalUtilValidateService = new GlobalUtilValidateService(globalUtilNumberService);
        linkEntityToLinkMapper = mock(LinkEntityToLinkMapper);
        linkService = new LinkService(
            instance(linkRepositoryMock),
            instance(tokenServiceMock),
            globalUtilValidateService,
            instance(linkEntityToLinkMapper)
        );
    });

    describe('createLink', () => {
        it('NameIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkCreateEmptyName = linkServiceTestData.getLinkCreateWithEmptyName();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.createLink(linkCreateEmptyName)).rejects.toThrowError(argumentError);
        });

        it('UrlIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkCreateEmptyUrl = linkServiceTestData.getLinkCreateWithEmptyUrl();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.createLink(linkCreateEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('LinkCreateOk_ShouldReturnLinkEntity', async () => {
            // Arrange
            const linkCreate = linkServiceTestData.getLinkCreate();
            const linkEntity = linkServiceTestData.getLinkEntity();
            const link = linkServiceTestData.getLink();
            const userId = linkServiceTestData.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(userId);
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(linkEntity);
            });
            when(linkEntityToLinkMapper.map(linkEntity)).thenReturn(link);

            // Act
            const result = await linkService.createLink(linkCreate);

            // Assert
            expect(result).toEqual(link);
        });
    });

    describe('updateLink', () => {
        it('NameIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkEmptyName = linkServiceTestData.getLinkWithEmptyName();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkName();

            // Act & Assert
            await expect(linkService.updateLink(linkEmptyName.id, linkEmptyName)).rejects.toThrowError(argumentError);
        });

        it('UrlIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkEmptyUrl = linkServiceTestData.getLinkWithEmptyUrl();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkUrl();

            // Act & Assert
            await expect(linkService.updateLink(linkEmptyUrl.id, linkEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('IdIsZero_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkIdIsZero = linkServiceTestData.getLinkWithZeroId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(anyNumber(), linkIdIsZero)).rejects.toThrow(argumentError);
        });

        it('IdIsNull_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkIdIsNull = linkServiceTestData.getLinkWithNullishId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(Number(null), linkIdIsNull)).rejects.toThrow(argumentError);
        });

        it('IdParameterNotSameIdBody_ShouldThrowInternalServerError', async () => {
            // Arrange
            const link = linkServiceTestData.getLink();
            const linkAlternative = linkServiceTestData.getLinkAlternative();
            const internalServerError = linkServiceTestData.getInternalServerErrorNotMatchParamAndBodyId();

            // Act & Assert
            await expect(linkService.updateLink(link.id, linkAlternative)).rejects.toThrow(internalServerError);
        });

        it('UpdateLinkOk_ShouldReturnLinkEntity', async () => {
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
            when(linkEntityToLinkMapper.map(linkEntity)).thenReturn(link);

            // Act
            const result = await linkService.updateLink(link.id, link);

            // Assert
            expect(result).toEqual(link);
        });
    });
});
