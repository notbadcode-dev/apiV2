import { ERROR_MESSAGE_TAG } from '@constant/error-message/error-message-tag.constant';
import { ERROR_MESSAGE_UTIL } from '@constant/error-message/error-message-util.constant';
import { TagEntity } from '@entity/tag.entity';
import { ArgumentError } from '@error/argument.error';
import { InternalServerError } from '@error/internal-server.error';
import { AutocompleteResultHelper, IAutocompleteResult } from '@model/autocomplete/autocomplete-result.model';
import { AutocompleteSearchHelper, IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';

export class TagServiceTestData {
    //#region Public methods

    //#region return TagEntity

    public getTagEntity(): TagEntity {
        const GROUP_LINK_ENTITY = new TagEntity();
        GROUP_LINK_ENTITY.id = 1;
        GROUP_LINK_ENTITY.name = 'Test Tag';
        GROUP_LINK_ENTITY.linkId = 1;
        return GROUP_LINK_ENTITY;
    }

    //#endregion

    //#region return ITagCreate

    public getTagCreate(): ITagCreate {
        return {
            name: 'Test Tag',
            linkId: 1,
        };
    }

    public getTagCreateWithEmptyName(): ITagCreate {
        return {
            ...this.getTagCreate(),
            name: '',
        };
    }

    public getTagCreateWithLinkIdIsZero(): ITagCreate {
        return {
            ...this.getTagCreate(),
            linkId: 0,
        };
    }

    public getTagCreateWithLinkIdIsNull(): ITagCreate {
        return {
            ...this.getTagCreate(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            linkId: null as any,
        };
    }

    //#endregion

    //#region return ITag

    public getTag(): ITag {
        return {
            id: 1,
            name: 'Test Tag',
        };
    }

    //#endregion

    //#region return IAutocompleteSearch

    public getDefaultAutocompleteSearch(): IAutocompleteSearch {
        return AutocompleteSearchHelper.getDefault();
    }

    public getAutocompleteSearchWithSearchText(): IAutocompleteSearch {
        return {
            ...AutocompleteSearchHelper.getDefault(),
            search: this.getTag().name,
        };
    }

    //#endregion

    //#region return IAutocompleteResult<ITag>

    public getDefaultAutocompleteResult(): IAutocompleteResult<ITag> {
        return AutocompleteResultHelper.mapFromAutocompleteSearch(this.getDefaultAutocompleteSearch(), [], []);
    }

    public getAutocompleteResultWhenExistTagNameContainsSearchText(): IAutocompleteResult<ITag> {
        return {
            ...this.getDefaultAutocompleteResult(),
            search: this.getTag().name,
            itemList: [this.getTag()],
        };
    }

    //#endregion

    //#region return throw exception

    public getArgumentErrorEmptyTagName(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_NAME_ARGUMENT);
    }

    public getArgumentErrorWrongId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_ID_ARGUMENT);
    }

    public getArgumentErrorWrongLinkId(): ArgumentError {
        return new ArgumentError(ERROR_MESSAGE_TAG.WRONG_LINK_ID_ARGUMENT);
    }

    public getInternalServerErrorNotMatchParamAndBodyId(): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_UTIL.NOT_MATCH_PARAM_ID_BODY_ID);
    }

    public getInternalServerErrorNotDeleteLink(tagName: string): InternalServerError {
        return new InternalServerError(ERROR_MESSAGE_TAG.COULD_NOT_DELETE_TAG(tagName));
    }

    //#endregion

    //#endregion
}
