import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { NotFountError } from '@error/not-found.error';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';
import { Repository } from 'typeorm';
import { IGroupLinkRepository } from './group-link.repository.interface';

const LINK_GROUP_RELATION_ENTITY_REPOSITORY_TOKEN = LinkGroupEntity.name;
export const GROUP_LINK_REPOSITORY_TOKEN = new Token<IGroupLinkRepository>('GroupLinkRepository');

@Service(GROUP_LINK_REPOSITORY_TOKEN)
export class GroupLinkRepository {
    constructor(
        @Inject(LINK_GROUP_RELATION_ENTITY_REPOSITORY_TOKEN)
        private readonly _linkGroupRepository: Repository<LinkGroupEntity>,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    public async getById(linkId: number): Promise<LinkGroupEntity> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const GROUP_LINK_ENTITY: LinkGroupEntity | null = await this._linkGroupRepository.findOneBy({ id: linkId, userId: USER_ID });

        if (!GROUP_LINK_ENTITY || !GROUP_LINK_ENTITY.id) {
            throw new NotFountError(ERROR_MESSAGE_GROUP_LINK.GROUP_LINK_WITH_ID_NOT_FOUND(linkId));
        }

        return GROUP_LINK_ENTITY;
    }
}
