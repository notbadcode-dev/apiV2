import { LinkRepository } from '@repository/link.repository';
import { LinkService } from '@service/link.service';
import { TokenService } from '@service/token.service';
import { anything, instance, mock, when } from 'ts-mockito';
import { LinkServiceTestData } from '../data/link.service.test.data';

describe('LinkService', () => {
    const linkServiceTestData: LinkServiceTestData = new LinkServiceTestData();

    let linkRepositoryMock: LinkRepository;
    let tokenServiceMock: TokenService;
    let linkService: LinkService;

    beforeEach(() => {
        linkRepositoryMock = mock(LinkRepository);
        tokenServiceMock = mock(TokenService);
        linkService = new LinkService(instance(linkRepositoryMock), instance(tokenServiceMock));
    });

    describe('createLink', () => {
        it('NameIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkCreateEmptyName = linkServiceTestData.getLinkCreateWithEmptyName();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkName();

            // Act + Assert
            await expect(linkService.createLink(linkCreateEmptyName)).rejects.toThrowError(argumentError);
        });

        it('UrlIsEmpty_ShouldThrowArgumentError', async () => {
            // Arrange
            const linkCreateEmptyUrl = linkServiceTestData.getLinkCreateWithEmptyUrl();
            const argumentError = linkServiceTestData.getArgumentErrorEmptyLinkUrl();

            // Act + Assert
            await expect(linkService.createLink(linkCreateEmptyUrl)).rejects.toThrow(argumentError);
        });

        it('CreateLinkOk_ShouldReturnLinkEntity', async () => {
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
});
