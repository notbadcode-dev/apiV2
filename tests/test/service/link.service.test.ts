import { LinkRepository } from '@repository/link.repository';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { LinkService } from '@service/link.service';
import { TokenService } from '@service/token.service';
import { LinkServiceTestData } from '@testData/service/link.service.test.data';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

describe('LinkService', () => {
    const linkServiceTestData: LinkServiceTestData = new LinkServiceTestData();

    let linkRepositoryMock: LinkRepository;
    let tokenServiceMock: TokenService;
    let globalUtilValidateService: GlobalUtilValidateService;
    let linkService: LinkService;

    beforeEach(() => {
        linkRepositoryMock = mock(LinkRepository);
        tokenServiceMock = mock(TokenService);
        globalUtilValidateService = mock(GlobalUtilValidateService);
        linkService = new LinkService(instance(linkRepositoryMock), instance(tokenServiceMock), instance(globalUtilValidateService));
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
            const userId = linkServiceTestData.getUserId();

            when(tokenServiceMock.getCurrentUserId()).thenReturn(userId);
            when(linkRepositoryMock.create(anything())).thenCall(async () => {
                return Promise.resolve(linkEntity);
            });

            // Act
            const result = await linkService.createLink(linkCreate);

            // Assert
            expect(result).toEqual(linkEntity);
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
            const linkEmptyUrl = linkServiceTestData.getLinkWithZeroId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(anyNumber(), linkEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('IdIsNull_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkEmptyUrl = linkServiceTestData.getLinkWithNullishId();
            const argumentError = linkServiceTestData.getArgumentErrorWrongId();

            // Act & Assert
            await expect(linkService.updateLink(Number(null), linkEmptyUrl)).rejects.toThrow(argumentError);
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

            // Act
            const result = await linkService.updateLink(link.id, link);

            // Assert
            expect(result).toEqual(linkEntity);
        });
    });
});
