import { DEFAULT_COLOR_GROUP_LINK, DEFAULT_GRADIENT_GROUP_LINK } from '@app/linkApi/infrastructure/constant/group-link.constant';
import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import {
    LinkGroupEntityToGroupMapper,
    LINK_GROUP_ENTITY_TO_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';

import { ILinkGroup } from '@model/group/group-link.model';
import { IGroup } from '@model/group/group.model';
import { ILink } from '@model/link/link.model';
import { GroupLinkRepository, GROUP_LINK_REPOSITORY_TOKEN } from '@repository/group-link.repository/group-link.repository';
import { LinkRepository, LINK_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';

export const GROUP_LINK_SERVICE_TOKEN = new Token<IGroupLinkService>('GroupLinkService');

@Service(GROUP_LINK_SERVICE_TOKEN)
export class GroupLinkService {
    constructor(
        @Inject(GROUP_LINK_REPOSITORY_TOKEN) private _groupLinkRepository: GroupLinkRepository,
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository,
        @Inject(LINK_GROUP_ENTITY_TO_GROUP_MAPPER) private _linkGroupEntityToGroupMapper: LinkGroupEntityToGroupMapper,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService
    ) {}

    @LoggerMethodDecorator
    public async getGroupLink(groupLinkId: number): Promise<ILinkGroup | null> {
        this.validateId(groupLinkId);

        const GROUP_LINK_ENTITY = await this._groupLinkRepository.getById(groupLinkId);
        const GROUP_LINK: ILinkGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_ENTITY);

        return GROUP_LINK;
    }

    @LoggerMethodDecorator
    public async createGroupLink(createGroupLink: IGroup): Promise<IGroup | null> {
        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_GROUP_ENTITY: LinkGroupEntity = {
            id: 0,
            name: createGroupLink.name,
            colorFrom: createGroupLink?.colorFrom ?? DEFAULT_COLOR_GROUP_LINK,
            colorTo: createGroupLink?.colorTo ?? DEFAULT_COLOR_GROUP_LINK,
            gradientType: DEFAULT_GRADIENT_GROUP_LINK,
            userId: USER_ID,
        };
        const GROUP_LINK_CREATED_SAVED = await this._groupLinkRepository.create(LINK_GROUP_ENTITY);
        const LINK_ENTITY_LIST = createGroupLink.linkList.map((link: ILink) => {
            const LINK_ENTITY = new LinkEntity();
            LINK_ENTITY.name = link.name;
            LINK_ENTITY.url = link.url;
            return LINK_ENTITY;
        });
        const LINK_LIST_CREATED_SAVED = await this._linkRepository.createList(LINK_ENTITY_LIST);
        const LINK_ID_LIST: number[] = LINK_LIST_CREATED_SAVED.map((link: ILink) => link.id) ?? [];
        const FIRST_ORDER: number = Math.max(...(createGroupLink?.linkList?.map((link: ILink) => link?.order ?? 0) ?? []));

        if (LINK_ID_LIST.length) {
            await this._groupLinkRepository.associateLinkListToGroup(GROUP_LINK_CREATED_SAVED.id, LINK_ID_LIST, FIRST_ORDER);
        }

        const GROUP_LINK: IGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_CREATED_SAVED) ?? null;
        return GROUP_LINK;
    }

    @LoggerMethodDecorator
    private validateId(groupLinkId: number): void {
        if (!groupLinkId || isNaN(Number(groupLinkId)) || groupLinkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_ID_ARGUMENT);
        }
    }

    private async createGroupLinkWithoutLinkList(createGroupLink: IGroup, userId: number): Promise<LinkGroupEntity> {
        const LINK_GROUP_ENTITY: LinkGroupEntity = {
            id: 0,
            name: createGroupLink.name,
            colorFrom: createGroupLink?.colorFrom ?? DEFAULT_COLOR_GROUP_LINK,
            colorTo: createGroupLink?.colorTo ?? DEFAULT_COLOR_GROUP_LINK,
            gradientType: DEFAULT_GRADIENT_GROUP_LINK,
            userId: userId,
        };
        const LINK_CREATED_SAVED = await this._groupLinkRepository.create(LINK_GROUP_ENTITY);
        return LINK_CREATED_SAVED;
    }
}
