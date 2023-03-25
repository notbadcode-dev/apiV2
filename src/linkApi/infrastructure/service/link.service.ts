import { LinkEntity } from 'linkApi/domain/entity/link.entity';
import { ILinkCreate } from 'linkApi/domain/model/link/link-create.model';
import { ILink } from 'linkApi/domain/model/link/link.model';
import { LinkRepository } from 'linkApi/domain/repository/link.repository';
import { ERROR_MESSAGE_LINK } from 'shared/constant/error-message/error-message-link.constant';
import { ArgumentError } from 'shared/error/argument.error';
import { LoggerMethodDecorator } from 'shared/service/decorator/logger-method.decorator';
import { TokenService } from 'shared/service/token.service';
import { Inject, Service } from 'typedi';

@Service()
export class LinkService {
    constructor(@Inject() private _linkRepository: LinkRepository, @Inject() private _tokenService: TokenService) {}

    @LoggerMethodDecorator
    public async createLink(createLink: ILinkCreate): Promise<ILink> {
        this.validateArgumentForCreateLink(createLink);

        const LINK_ENTITY: LinkEntity = {
            id: 0,
            name: createLink.name,
            url: createLink.url,
            favorite: false,
            active: true,
            userId: this._tokenService.getCurrentUserId(),
        };
        const LINK_CREATED_SAVED = await this._linkRepository.create(LINK_ENTITY);

        return LINK_CREATED_SAVED;
    }

    @LoggerMethodDecorator
    private async validateArgumentForCreateLink(createLink: ILinkCreate): Promise<void> {
        if (createLink === null) {
            throw new ArgumentError();
        }

        if (!createLink?.name?.length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_NAME_ARGUMENT);
        }

        if (!createLink?.url?.length) {
            throw new ArgumentError(ERROR_MESSAGE_LINK.WRONG_URL_ARGUMENT);
        }
    }
}
