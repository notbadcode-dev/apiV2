import { TagEntity } from '@entity/tag.entity';
import { TagEntityToTagMapper } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';
import { TagRepository } from '@repository/tag.repository/tag.repository';
import { TokenService } from '@service/middleware/token.service/token.service';
import { TagService } from '@service/tag.service/tag.service';
import { ITagService } from '@service/tag.service/tag.service.interface';
import { GenericTestData } from '@testData/service/generic.test.data';
import { TagServiceTestData } from '@testData/service/tag.service.test.data';
import { anything, instance, mock, when } from 'ts-mockito';

//#region Attributes

let _tagServiceMock: ITagService;
let _tagRepositoryMock: TagRepository;
let _tokenServiceMock: TokenService;
let _tagEntityToTagMapperMock: TagEntityToTagMapper;

//#endregion

//#region Constructor

function generateTagService(): void {
    _tagRepositoryMock = mock(TagRepository);
    _tokenServiceMock = mock(TokenService);
    _tagEntityToTagMapperMock = mock(TagEntityToTagMapper);

    _tagServiceMock = new TagService(instance(_tagRepositoryMock), instance(_tokenServiceMock), instance(_tagEntityToTagMapperMock));
}

beforeEach(() => {
    generateTagService();
});

//#endregion

//#region Test data

const TAG_SERVICE_TEST_DATA: TagServiceTestData = new TagServiceTestData();
const GENERIC_TEST_DATA: GenericTestData = new GenericTestData();

const TAG: ITag = TAG_SERVICE_TEST_DATA.getTag();
const TAG_ENTITY: TagEntity = TAG_SERVICE_TEST_DATA.getTagEntity();
const TAG_EMPTY_NAME_ARGUMENT_ERROR = TAG_SERVICE_TEST_DATA.getArgumentErrorEmptyTagName();
const TAG_LINK_ID_ARGUMENT_ERROR = TAG_SERVICE_TEST_DATA.getArgumentErrorWrongLinkId();
const USER_ID = GENERIC_TEST_DATA.getUserId();

//#endregion

describe('createTag', () => {
    it('Creating a tag with empty name should throw an argument error', async () => {
        // Arrange
        const TAG_CREATE_EMPTY_NAME: ITagCreate = TAG_SERVICE_TEST_DATA.getTagCreateWithEmptyName();

        // Act & Assert
        await expect(_tagServiceMock.createTag(TAG_CREATE_EMPTY_NAME)).rejects.toThrowError(TAG_EMPTY_NAME_ARGUMENT_ERROR);
    });

    it('Creating a tag with link id is Zero should throw an argument error', async () => {
        // Arrange
        const TAG_CREATE_LINK_ID_ZERO: ITagCreate = TAG_SERVICE_TEST_DATA.getTagCreateWithLinkIdIsZero();

        // Act & Assert
        await expect(_tagServiceMock.createTag(TAG_CREATE_LINK_ID_ZERO)).rejects.toThrowError(TAG_LINK_ID_ARGUMENT_ERROR);
    });

    it('Creating a tag with link id is null should throw an argument error', async () => {
        // Arrange
        const TAG_CREATE_LINK_ID_NULL: ITagCreate = TAG_SERVICE_TEST_DATA.getTagCreateWithLinkIdIsNull();

        // Act & Assert
        await expect(_tagServiceMock.createTag(TAG_CREATE_LINK_ID_NULL)).rejects.toThrowError(TAG_LINK_ID_ARGUMENT_ERROR);
    });

    it('Creating a tag without should return a tag entity', async () => {
        // Arrange
        const TAG_CREATE: ITagCreate = TAG_SERVICE_TEST_DATA.getTagCreate();

        when(_tokenServiceMock.getCurrentUserId()).thenReturn(USER_ID);
        when(_tagRepositoryMock.create(anything())).thenResolve(TAG_ENTITY);
        when(_tagEntityToTagMapperMock.map(anything())).thenReturn(TAG);

        // Act
        const RESULT = await _tagServiceMock.createTag(TAG_CREATE);

        // Assert
        expect(RESULT?.id).not.toBeNull();
        expect(RESULT?.id).toBeGreaterThan(0);
        expect(RESULT?.id).toEqual(TAG.id);
    });
});
