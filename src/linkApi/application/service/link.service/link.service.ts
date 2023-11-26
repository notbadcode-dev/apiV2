import { ENTITY_CONSTANT } from '@constant/entity.constant';
import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LINK_CONSTANT } from '@constant/link.constant copy';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { LinkEntityToLinkMapper, LINK_ENTITY_TO_LINK_MAPPER } from '@mapper/link/linkEntityToLink.mapper/linkEntityToLink.mapper';
import { IGroupLink } from '@model/group/group-link.model';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LinkRepository, LINK_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import {
    GlobalUtilValidateService,
    GLOBAL_UTIL_VALIDATE_SERVICE,
} from '@service/global/global.util.validate.service/global.util.validate.service';
import { ILinkService } from '@service/link.service/link.service.interface';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';

export const LINK_SERVICE_TOKEN = new Token<ILinkService>('LinkService');

@Service(LINK_SERVICE_TOKEN)
export class LinkService implements ILinkService {
    //#region Constructor

    constructor(
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject(GLOBAL_UTIL_VALIDATE_SERVICE) private _globalUtilValidateService: GlobalUtilValidateService,
        @Inject(LINK_ENTITY_TO_LINK_MAPPER) private _linkEntityToLinkMapper: LinkEntityToLinkMapper
    ) {}

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public async createLink(linkCreate: ILinkCreate): Promise<ILink> {
        this.validateArgumentForCreateLink(linkCreate);

        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY: LinkEntity = new LinkEntity();
        LINK_ENTITY.id = ENTITY_CONSTANT.CREATE_DEFAULT_ID;
        LINK_ENTITY.name = linkCreate.name;
        LINK_ENTITY.url = linkCreate.url;
        LINK_ENTITY.favorite = linkCreate?.favorite ?? LINK_CONSTANT.DEFAULT_FAVORITE;
        LINK_ENTITY.active = linkCreate?.active ?? LINK_CONSTANT.DEFAULT_FAVORITE;
        LINK_ENTITY.groupLinkId = Number(linkCreate.groupLinkId);
        LINK_ENTITY.userId = USER_ID;

        const LINK_CREATED_SAVED = await this._linkRepository.create(LINK_ENTITY);

        const LINK: ILink = this._linkEntityToLinkMapper.map(LINK_CREATED_SAVED);
        return LINK;
    }

    @LoggerMethodDecorator
    public async updateLink(linkId: number, link: ILink): Promise<ILink> {
        this.validateArgumentForUpdateLink(link);

        this._globalUtilValidateService.controlSameIdOnParamAndBody(linkId, link.id);

        const LINK_UPDATED: ILink = await this.updaterLink(link);
        return LINK_UPDATED;
    }

    @LoggerMethodDecorator
    public async getLink(linkId: number): Promise<ILink> {
        this.validateId(linkId);

        const LINK_ENTITY = await this._linkRepository.getById(linkId);
        const LINK: ILink = this._linkEntityToLinkMapper.map(LINK_ENTITY);
        return LINK;
    }

    @LoggerMethodDecorator
    public async getLinkList(): Promise<ILink[]> {
        const LINK_ENTITY_LIST: LinkEntity[] = await this._linkRepository.getAll();
        const LINK_LIST: ILink[] = LINK_ENTITY_LIST.map((LINK_ENTITY: LinkEntity) => {
            const LINK = this._linkEntityToLinkMapper.map(LINK_ENTITY);
            return LINK;
        });
        return LINK_LIST;
    }

    @LoggerMethodDecorator
    public async getPaginateLinkList(paginateLinkList: IPaginateItem<ILink>): Promise<IPaginateItem<ILink>> {
        this._globalUtilValidateService.validatePaginate<ILink>(paginateLinkList);

        const PAGINATE_LINK_ENTITY: IPaginateItem<LinkEntity> = await this._linkRepository.getAllPaginated(paginateLinkList);
        const LINK_LIST: ILink[] =
            PAGINATE_LINK_ENTITY?.itemList?.map((LINK_ENTITY: LinkEntity) => this._linkEntityToLinkMapper.map(LINK_ENTITY)) ?? [];

        const PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
            ...PAGINATE_LINK_ENTITY,
            itemList: LINK_LIST,
        };
        return PAGINATE_LINK_LIST;
    }

    @LoggerMethodDecorator
    public async changeActiveLink(linkId: number, active: boolean): Promise<ILink> {
        this.validateId(linkId);

        const LINK: ILink = await this.getLinkFromLinkId(linkId);

        if (LINK.active === active || typeof active !== 'boolean') {
            return LINK;
        }

        this.validateArgumentForUpdateLink(LINK);

        LINK.active = active;
        const LINK_UPDATED: ILink = await this.updaterLink(LINK);
        return LINK_UPDATED;
    }

    @LoggerMethodDecorator
    public async changeFavoriteLink(linkId: number, favorite: boolean): Promise<ILink> {
        this.validateId(linkId);

        const LINK: ILink = await this.getLinkFromLinkId(linkId);

        if (LINK.favorite === favorite || typeof favorite !== 'boolean') {
            return LINK;
        }

        this.validateArgumentForUpdateLink(LINK);

        LINK.favorite = favorite;
        const LINK_UPDATED: ILink = await this.updaterLink(LINK);
        return LINK_UPDATED;
    }

    @LoggerMethodDecorator
    public async deleteLink(deleteLinkId: number): Promise<boolean> {
        this.validateId(deleteLinkId);

        const SUCCESSFULLY_DELETE_LINK = await this._linkRepository.delete(deleteLinkId);
        return SUCCESSFULLY_DELETE_LINK;
    }

    //#endregion

    //#region Private methods

    @LoggerMethodDecorator
    private async updaterLink(updaterLink: ILink): Promise<ILink> {
        const UPDATE_LINK_ENTITY = await this._linkRepository.getById(updaterLink.id);

        UPDATE_LINK_ENTITY.name = updaterLink.name;
        UPDATE_LINK_ENTITY.url = updaterLink.url;
        UPDATE_LINK_ENTITY.favorite = updaterLink?.favorite ?? LINK_CONSTANT.DEFAULT_ACTIVE;
        UPDATE_LINK_ENTITY.active = updaterLink?.active ?? LINK_CONSTANT.DEFAULT_FAVORITE;

        if (!UPDATE_LINK_ENTITY.displayOrder) {
            UPDATE_LINK_ENTITY.displayOrder = await this._linkRepository.getNextDisplayOrder(
                UPDATE_LINK_ENTITY.userId,
                UPDATE_LINK_ENTITY?.groupLinkId
            );
        }

        const LINK_UPDATED = await this._linkRepository.update(UPDATE_LINK_ENTITY);
        const LINK_MAPPED: ILink = this._linkEntityToLinkMapper.map(LINK_UPDATED);
        return LINK_MAPPED;
    }

    @LoggerMethodDecorator
    private async getLinkFromLinkId(linkId: number): Promise<ILink> {
        const LINK_ENTITY: LinkEntity = await this._linkRepository.getById(linkId);
        const LINK: ILink = this._linkEntityToLinkMapper.map(LINK_ENTITY);

        return LINK;
    }

    @LoggerMethodDecorator
    private validateArgumentForCreateLink(linkCreate: ILinkCreate): void {
        this.validateName(linkCreate?.name?.trim());
        this.validateUrl(linkCreate?.url?.trim());
    }

    @LoggerMethodDecorator
    private validateArgumentForUpdateLink(updateLink: ILink): void {
        this.validateName(updateLink?.name?.trim());
        this.validateUrl(updateLink?.url?.trim());
        this.validateId(updateLink?.id);
    }

    @LoggerMethodDecorator
    private validateId(linkId: number): void {
        if (!linkId || isNaN(Number(linkId)) || linkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateName(linkName?: string): void {
        if (!linkName?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateUrl(linkUrl?: string): void {
        if (!linkUrl?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
        }

        const GROUP_LINK_LIST: IGroupLink[] = [
            {
                id: 1,
                displayOrder: 1,
                name: 'Multimedia',
                colorFrom: '833AB4',
                colorTo: 'FD1D1D',
                gradientType: 'linear',
                linkList: [
                    {
                        id: 1,
                        name: 'Apple music',
                        url: 'https://music.apple.com/',
                        linkGroupId: 1,
                        displayOrder: 1,
                        favorite: false,
                        active: true,
                        tagList: [
                            {
                                id: 1,
                                name: 'Apple',
                            },
                            {
                                id: 2,
                                name: 'Music',
                            },
                            {
                                id: 3,
                                name: 'Online',
                            },
                        ],
                    },
                    {
                        id: 2,
                        name: 'Spotify',
                        url: 'https://open.spotify.com/',
                        linkGroupId: 1,
                        displayOrder: 2,
                        favorite: false,
                        active: true,
                        tagList: [
                            {
                                id: 4,
                                name: 'Music',
                            },
                        ],
                    },
                    {
                        id: 3,
                        name: 'Pocket Casts',
                        url: 'https://pocketcasts.com/',
                        linkGroupId: 1,
                        displayOrder: 4,
                        favorite: false,
                        active: true,
                        tagList: [
                            {
                                id: 5,
                                name: 'Podcast',
                            },
                            {
                                id: 6,
                                name: 'Online',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                displayOrder: 2,
                name: 'Sport',
                colorFrom: '22C1C3',
                colorTo: 'fDBB2D',
                gradientType: 'linear',
                linkList: [
                    {
                        id: 4,
                        name: 'Sport',
                        url: 'https://www.sport.es/es/',
                        linkGroupId: 1,
                        displayOrder: 1,
                        favorite: false,
                        active: true,
                        tagList: [
                            {
                                id: 7,
                                name: 'Futbol',
                            },
                        ],
                    },
                    {
                        id: 5,
                        name: 'Marca',
                        url: 'https://www.marca.com/',
                        linkGroupId: 1,
                        displayOrder: 1,
                        favorite: false,
                        active: true,
                        tagList: [
                            {
                                id: 8,
                                name: 'Futbol',
                            },
                        ],
                    },
                ],
            },
        ];
        console.log(GROUP_LINK_LIST);
    }

    //#endregion
}
