import { ENTITY_CONSTANT } from '@constant/entity.constant';
import { ERROR_MESSAGE_TAG } from '@constant/error-message/error-message-tag.constant';
import { TagEntity } from '@entity/tag.entity';
import { ArgumentError } from '@error/argument.error';
import { TagEntityToTagMapper, TAG_ENTITY_TO_TAG_MAPPER } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
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
    private validateArgumentForUpdateLink(updateTag: ITag): void {
        this.validateName(updateTag?.name?.trim());
        this.validateId(updateTag?.id);
    }

    //#endregion
}
