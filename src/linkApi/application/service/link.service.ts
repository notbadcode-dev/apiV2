import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { LinkEntityToLinkMapper } from '@mapper/link/linkEntityToLink.mapper';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { LinkRepository } from '@repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { GlobalUtilValidateService } from '@service/global/global.util.validate.service';
import { ILinkService } from '@service/interface/link.service.interface';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/token.service';
import { Inject, Service, Token } from 'typedi';

export const LINK_SERVICE_TOKEN = new Token<ILinkService>('LinkService');

@Service(LINK_SERVICE_TOKEN)
export class LinkService implements ILinkService {
    constructor(
        @Inject() private _linkRepository: LinkRepository,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject() private _globalUtilValidateService: GlobalUtilValidateService,
        @Inject() private _linkEntityToLinkMapper: LinkEntityToLinkMapper
    ) {}

    @LoggerMethodDecorator
    public async createLink(linkCreate: ILinkCreate): Promise<ILink> {
        this.validateArgumentForCreateLink(linkCreate);

        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_ENTITY: LinkEntity = {
            id: 0,
            name: linkCreate.name,
            url: linkCreate.url,
            favorite: false,
            active: true,
            userId: USER_ID,
        };
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

    @LoggerMethodDecorator
    private async updaterLink(updaterLink: ILink): Promise<ILink> {
        const LINK_UPDATED = await this._linkRepository.update(updaterLink);
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
    private validateName(nameLink?: string): void {
        if (!nameLink?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateUrl(urlLink?: string): void {
        if (!urlLink?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
        }
    }
}
