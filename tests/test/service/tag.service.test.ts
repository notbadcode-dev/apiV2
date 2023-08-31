import { TagEntity } from '@entity/tag.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { TagEntityToTagMapper } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { IAutocompleteResult } from '@model/autocomplete/autocomplete-result.model';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';
import { TagRepository } from '@repository/tag.repository/tag.repository';
import { TokenService } from '@service/middleware/token.service/token.service';
import { TagService } from '@service/tag.service/tag.service';
import { ITagService } from '@service/tag.service/tag.service.interface';
import { GenericTestData } from '@testData/service/generic.test.data';
import { TagServiceTestData } from '@testData/service/tag.service.test.data';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

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
const TAG_WRONG_ID_ARGUMENT_ERROR: ArgumentError = TAG_SERVICE_TEST_DATA.getArgumentErrorWrongId();
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

describe('deleteLink', () => {
    const INTERNAL_SERVER_ERROR_DELETE_LINK: InternalServerError = TAG_SERVICE_TEST_DATA.getInternalServerErrorNotDeleteLink(
        TAG_ENTITY.name
    );

    it('Deleting a tag with zero ID should throw an argument error', async () => {
        // Act & Assert
        await expect(_tagServiceMock.deleteTag(anyNumber())).rejects.toThrow(TAG_WRONG_ID_ARGUMENT_ERROR);
    });

    it('Deleting a tag with nullish Id should throw an argument error', async () => {
        // Act & Assert
        await expect(_tagServiceMock.deleteTag(Number(null))).rejects.toThrow(TAG_WRONG_ID_ARGUMENT_ERROR);
    });

    it('Should throw error when delete operation fails', async () => {
        // Arrange
        when(_tagRepositoryMock.delete(TAG_ENTITY.id)).thenReject(INTERNAL_SERVER_ERROR_DELETE_LINK);

        // Act & Assert
        await expect(_tagServiceMock.deleteTag(TAG_ENTITY.id)).rejects.toThrowError(INTERNAL_SERVER_ERROR_DELETE_LINK);
    });

    it('Should delete existing tag and return true', async () => {
        // Arrange
        when(_tagRepositoryMock.getById(TAG_ENTITY.id)).thenResolve(TAG_ENTITY);
        when(_tagRepositoryMock.delete(TAG_ENTITY.id)).thenResolve(true);

        // Act
        const RESULT: boolean = await _tagServiceMock.deleteTag(TAG_ENTITY.id);

        // Assert
        expect(RESULT).toBe(true);
    });
});

describe('getAutocomplete', () => {
    describe('getAutocomplete', () => {
        it('Should return empty result when search text is empty', async () => {
            // Act
            const RESULT: IAutocompleteResult<ITag> = await _tagServiceMock.getAutocomplete(
                TAG_SERVICE_TEST_DATA.getDefaultAutocompleteSearch()
            );

            // Assert
            expect(RESULT.search?.length).toStrictEqual(0);
            expect(RESULT.itemList?.length).toStrictEqual(0);
            expect(RESULT.lastUsedItemList?.length).toStrictEqual(0);
        });

        it('Should return empty result when tag list is empty', async () => {
            // Arrange
            when(_tagRepositoryMock.getAll()).thenResolve([]);

            // Act
            const RESULT: IAutocompleteResult<ITag> = await _tagServiceMock.getAutocomplete(
                TAG_SERVICE_TEST_DATA.getAutocompleteSearchWithSearchText()
            );

            // Assert
            expect(RESULT.search?.length).toBeGreaterThan(0);
            expect(RESULT.itemList?.length).toStrictEqual(0);
            expect(RESULT.lastUsedItemList?.length).toStrictEqual(0);
        });

        it('Should return all tags when search text is empty and returnExcludedList is true', async () => {
            // TODO: Implementar prueba: Debería devolver todas las etiquetas cuando el texto de búsqueda está vacío y returnExcludedList es true
        });

        it('Should filter excluded items and return last used items when configured', async () => {
            // TODO: Implementar prueba: Debería filtrar elementos excluidos y devolver elementos utilizados recientemente cuando está configurado
        });

        it('Should return filtered and mapped results when search text is provided', async () => {
            // TODO: Implementar prueba: Debería devolver resultados filtrados y mapeados cuando se proporciona el texto de búsqueda
        });

        it('Should filter excluded items when returnExcludedList is true', async () => {
            // TODO: Implementar prueba: Debería filtrar elementos excluidos cuando returnExcludedList es true
        });

        it('Should return last used items when returnedLastUsedItems is true', async () => {
            // TODO: Implementar prueba: Debería devolver elementos utilizados recientemente cuando returnedLastUsedItems es true
        });

        it('Should filter excluded items and return last used items when both configurations are true', async () => {
            // TODO: Implementar prueba: Debería filtrar elementos excluidos y devolver elementos utilizados recientemente cuando ambas configuraciones son true
        });

        it('Should return last used items even if no other results match', async () => {
            // TODO: Implementar prueba: Debería devolver elementos utilizados recientemente incluso si no coinciden con otros resultados
        });

        it('Should skip specified number of items', async () => {
            // TODO: Implementar prueba: Debería omitir el número especificado de elementos
        });

        it('Should take specified number of items', async () => {
            // TODO: Implementar prueba: Debería tomar el número especificado de elementos
        });

        it('Should return correct results when both skip and take are specified', async () => {
            // TODO: Implementar prueba: Debería devolver resultados correctos cuando se especifican ambos omitir y tomar
        });

        it('Should take default "take" value if not provided', async () => {
            // TODO: Implementar prueba: Debería tomar el valor predeterminado de "take" si no se proporciona
        });

        it('Should skip default "skip" value if not provided', async () => {
            // TODO: Implementar prueba: Debería omitir el valor predeterminado de "skip" si no se proporciona
        });

        it('Last used items list should have a maximum of 3 items', async () => {
            // TODO: Implementar prueba: La lista de elementos utilizados recientemente debería tener un máximo de 3 elementos
        });

        it('Should not consider excluded items if they are part of excludedItemContainTextList', async () => {
            // TODO: Implementar prueba: No debería considerar elementos excluidos si están en excludedItemContainTextList y buscarlos de todos modos
        });
    });
});
