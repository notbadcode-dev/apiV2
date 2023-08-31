import { ENTITY_CONSTANT } from '@constant/entity.constant';
import { ERROR_MESSAGE_TAG } from '@constant/error-message/error-message-tag.constant';
import { TagEntity } from '@entity/tag.entity';
import { ArgumentError } from '@error/argument.error';
import { TagEntityToTagMapper, TAG_ENTITY_TO_TAG_MAPPER } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { IAutocompleteResult, IAutocompleteResultHelper } from '@model/autocomplete/autocomplete-result.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';
import { TagRepository, TAG_REPOSITORY_TOKEN } from '@repository/tag.repository/tag.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { ITagService } from '@service/tag.service/tag.service.interface';
import { Inject, Service, Token } from 'typedi';

export const TAG_SERVICE_TOKEN = new Token<ITagService>('TagService');

@Service(TAG_SERVICE_TOKEN)
export class TagService implements ITagService {
    //#region Constructor

    constructor(
        @Inject(TAG_REPOSITORY_TOKEN) private _tagRepository: TagRepository,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject(TAG_ENTITY_TO_TAG_MAPPER) private _tagEntityToTagMapper: TagEntityToTagMapper
    ) {}

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public async createTag(createTag: ITagCreate): Promise<ITag> {
        this.validateArgumentForCreateLink(createTag);

        const USER_ID: number = this._tokenService.getCurrentUserId();
        const TAG_ENTITY: TagEntity = new TagEntity();
        TAG_ENTITY.id = ENTITY_CONSTANT.CREATE_DEFAULT_ID;
        TAG_ENTITY.name = createTag.name;
        TAG_ENTITY.linkId = createTag.linkId;
        TAG_ENTITY.userId = USER_ID;

        const TAG_CREATED_SAVED = await this._tagRepository.create(TAG_ENTITY);

        const TAG: ITag = this._tagEntityToTagMapper.map(TAG_CREATED_SAVED);
        return TAG;
    }

    @LoggerMethodDecorator
    public async getAutocomplete(tagAutocompleteSearch: IAutocompleteSearch): Promise<IAutocompleteResult<ITag>> {
        const SEARCH_TEXT: string = tagAutocompleteSearch?.search ?? '';

        if (!SEARCH_TEXT?.length) {
            return IAutocompleteResultHelper.mapFromAutocompleteSearch(tagAutocompleteSearch, new Array<ITag>());
        }

        const TAG_ENTITY_LIST = await this._tagRepository.getAll();

        if (!TAG_ENTITY_LIST?.length) {
            return IAutocompleteResultHelper.mapFromAutocompleteSearch(tagAutocompleteSearch, new Array<ITag>());
        }

        let tagListFilteredWithSearchText: ITag[] = this.getTagListFilteredWithSearchText(
            this._tagEntityToTagMapper.mapToList(TAG_ENTITY_LIST),
            SEARCH_TEXT
        );

        tagListFilteredWithSearchText = this.getTagListFiltered(tagListFilteredWithSearchText, tagAutocompleteSearch);

        const AUTOCOMPLETE_RESULT = IAutocompleteResultHelper.mapFromAutocompleteSearch(
            tagAutocompleteSearch,
            tagListFilteredWithSearchText
        );

        if (tagAutocompleteSearch.returnedLastUsedItems) {
            const LAST_USED_ITEMS: TagEntity[] = await this._tagRepository.getLastUsedTagList();
            const LAST_USED_TAG_LIST = this._tagEntityToTagMapper.mapToList(LAST_USED_ITEMS);

            AUTOCOMPLETE_RESULT.lastUsedItemList = this.getTagListFiltered(LAST_USED_TAG_LIST, tagAutocompleteSearch);
        }

        return AUTOCOMPLETE_RESULT;
    }

    @LoggerMethodDecorator
    public async deleteTag(deleteTagId: number): Promise<boolean> {
        this.validateId(deleteTagId);

        const SUCCESSFULLY_DELETE_TAG = await this._tagRepository.delete(deleteTagId);
        return SUCCESSFULLY_DELETE_TAG;
    }

    //#region Private methods

    @LoggerMethodDecorator
    private validateId(tagId?: number): void {
        if (!tagId || isNaN(Number(tagId)) || tagId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_TAG.WRONG_ID_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateLinkId(linkId?: number): void {
        if (!linkId || isNaN(Number(linkId)) || linkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_TAG.WRONG_LINK_ID_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateName(tagName?: string): void {
        if (!tagName?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_TAG.WRONG_NAME_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateArgumentForCreateLink(createTag: ITagCreate): void {
        this.validateName(createTag?.name?.trim());
        this.validateLinkId(createTag?.linkId ?? null);
    }

    @LoggerMethodDecorator
    private getTagListFilteredWithSearchText(tagList: ITag[], searchText: string): ITag[] {
        if (!tagList?.length || !searchText?.length) {
            return new Array<ITag>();
        }

        return tagList.filter((tag: ITag) =>
            tag.name
                .trim()
                .toLowerCase()
                .includes(searchText?.trim().toLowerCase() ?? '')
        );
    }

    @LoggerMethodDecorator
    private getTagListFilteredWithExcludedItemIdList(tagList: ITag[], excludedItemIdList: number[]): ITag[] {
        if (!excludedItemIdList?.length) {
            return tagList;
        }

        return tagList.filter((tag: ITag) => !excludedItemIdList?.includes(tag?.id ?? 0));
    }

    @LoggerMethodDecorator
    private getTagListFilteredWithTagNameContainsText(tagList: ITag[], excludedItemContainTextList: string[]): ITag[] {
        if (!excludedItemContainTextList?.length) {
            return tagList;
        }

        const EXCLUDED_TEXT_LIST: string[] = excludedItemContainTextList.map((text: string) => text.trim().toLowerCase());

        let tagContainTextList: ITag[] = tagList;

        for (const EXCLUDED_TEXT of EXCLUDED_TEXT_LIST) {
            tagContainTextList = tagContainTextList.filter((tag: ITag) => !tag?.name.trim().toLowerCase().includes(EXCLUDED_TEXT));
        }

        return tagContainTextList;
    }

    @LoggerMethodDecorator
    private getTagListFiltered(tagListFilteredWithSearchText: ITag[], tagAutocompleteSearch: IAutocompleteSearch): ITag[] {
        tagListFilteredWithSearchText = this.getTagListFilteredWithExcludedItemIdList(
            tagListFilteredWithSearchText,
            tagAutocompleteSearch?.excludedItemIdList ?? []
        );

        tagListFilteredWithSearchText = this.getTagListFilteredWithTagNameContainsText(
            tagListFilteredWithSearchText,
            tagAutocompleteSearch?.excludedItemContainTextList ?? []
        );
        return tagListFilteredWithSearchText;
    }

    //#endregion
}
