import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { ArgumentError } from '@error/argument.error';
import {
    LinkGroupEntityToGroupMapper,
    LINK_GROUP_ENTITY_TO_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { LinkToLinkEntityMapper, LINK_TO_LINK_ENTITY_MAPPER } from '@mapper/link/linkToLinkEntity.mapper/linkToLinkEntity.mapper';

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
        @Inject(LINK_GROUP_ENTITY_TO_GROUP_MAPPER) private _linkGroupEntityToGroupMapper: LinkGroupEntityToGroupMapper,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject(LINK_TO_LINK_ENTITY_MAPPER) private _linkToLinkEntityMapper: LinkToLinkEntityMapper,
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository
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
        const LINK_GROUP_ENTITY: GroupLinkEntity = new GroupLinkEntity();

        LINK_GROUP_ENTITY.id = 0;
        LINK_GROUP_ENTITY.name = createGroupLink.name;
        LINK_GROUP_ENTITY.colorFrom = createGroupLink?.colorFrom ?? GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        LINK_GROUP_ENTITY.colorTo = createGroupLink?.colorTo ?? GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        LINK_GROUP_ENTITY.gradientType = createGroupLink?.gradientType ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        LINK_GROUP_ENTITY.userId = USER_ID;

        const GROUP_LINK_CREATED_SAVED = await this._groupLinkRepository.create(LINK_GROUP_ENTITY);

        if (createGroupLink?.linkList?.length) {
            const LINK_ENTITY_LIST = createGroupLink?.linkList.map((link: ILink) => {
                const LINK_ENTITY = this._linkToLinkEntityMapper.map(link);
                LINK_ENTITY.id = 0;
                LINK_ENTITY.groupLinkId = GROUP_LINK_CREATED_SAVED.id;
                LINK_ENTITY.userId = USER_ID;
                LINK_ENTITY.displayOrder = link.displayOrder;
                return LINK_ENTITY;
            });
            await this._linkRepository.createList(LINK_ENTITY_LIST);
        }

        const GROUP_LINK_CREATED = await this._groupLinkRepository.getById(GROUP_LINK_CREATED_SAVED.id);
        const GROUP_LINK: IGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_CREATED) ?? null;
        return GROUP_LINK;
    }

    @LoggerMethodDecorator
    private validateId(groupLinkId: number): void {
        if (!groupLinkId || isNaN(Number(groupLinkId)) || groupLinkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_ID_ARGUMENT);
        }
    }
}
