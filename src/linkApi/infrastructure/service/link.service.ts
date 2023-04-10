import { ERROR_MESSAGE_LINK } from '@constant/error-message/error-message-link.constant';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import { ILinkCreate } from '@model/link/link-create.model';
import { ILink } from '@model/link/link.model';
import { LinkRepository } from '@repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService } from '@service/token.service';
import { Inject, Service } from 'typedi';

@Service()
export class LinkService {
    constructor(@Inject() private _linkRepository: LinkRepository, @Inject() private _tokenService: TokenService) {}

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

        return LINK_CREATED_SAVED;
    }

    @LoggerMethodDecorator
    public async updateLink(linkCreate: ILinkCreate): Promise<ILink> {
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

        return LINK_CREATED_SAVED;
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

        if (!updateLink?.id) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
        }
    }
}
