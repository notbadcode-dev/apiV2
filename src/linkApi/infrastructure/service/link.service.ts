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
import { TokenService } from '@service/token.service';
import { Inject, Service } from 'typedi';

@Service()
export class LinkService {
    constructor(
        @Inject() private _linkRepository: LinkRepository,
        @Inject() private _tokenService: TokenService,
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
        const USER_UPDATED = await this._linkRepository.update(link);

        const LINK: ILink = this._linkEntityToLinkMapper.map(USER_UPDATED);
        return LINK;
    }

    @LoggerMethodDecorator
    public async getLink(linkId: number): Promise<ILink> {
        this.validateIdArgument(linkId);

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
        const PAGINATE_LINK_ENTITY: IPaginateItem<LinkEntity> = await this._linkRepository.getAllPaginated(paginateLinkList);
        const LINK_LIST: ILink[] =
            PAGINATE_LINK_ENTITY?.itemList?.map((LINK_ENTITY: LinkEntity) => this._linkEntityToLinkMapper.map(LINK_ENTITY)) ?? [];

        const PAGINATE_LINK_LIST: IPaginateItem<ILink> = {
            ...PAGINATE_LINK_ENTITY,
            itemList: LINK_LIST,
        };
        return PAGINATE_LINK_LIST;
    }

    private validateArgumentForCreateLink(linkCreate: ILinkCreate): void {
        if (!linkCreate?.name?.trim()) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
        }

        if (!linkCreate?.url?.trim()) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
        }
    }

    private validateArgumentForUpdateLink(updateLink: ILink): void {
        this.validateArgumentForCreateLink(updateLink);
        this.validateIdArgument(updateLink?.id);
    }

    private validateIdArgument(id: number): void {
        if (!id) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
        }

        if (isNaN(Number(id))) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_ID_ARGUMENT);
        }
    }
}
