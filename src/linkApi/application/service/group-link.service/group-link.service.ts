import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { ArgumentError } from '@error/argument.error';
import {
    LinkGroupEntityToLinkGroupMapper,
    LINK_GROUP_ENTITY_TO_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToLinkGroup.mapper/linkGroupEntityToLinkGroup.mapper';
import { ILinkGroup } from '@model/group/group-link.model';
import { GroupLinkRepository, GROUP_LINK_REPOSITORY_TOKEN } from '@repository/group-link.repository/group-link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { Inject, Service, Token } from 'typedi';

export const GROUP_LINK_SERVICE_TOKEN = new Token<IGroupLinkService>('GroupLinkService');

@Service(GROUP_LINK_SERVICE_TOKEN)
export class GroupLinkService implements IGroupLinkService {
    constructor(
        @Inject(GROUP_LINK_REPOSITORY_TOKEN) private _groupLinkRepository: GroupLinkRepository,
        @Inject(LINK_GROUP_ENTITY_TO_GROUP_MAPPER) private _linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper
    ) {}

    @LoggerMethodDecorator
    public async getGroupLink(groupLinkId: number): Promise<ILinkGroup | null> {
        this.validateId(groupLinkId);

        const LINK_ENTITY = await this._groupLinkRepository.getById(groupLinkId);
        const LINK: ILinkGroup | null = this._linkGroupEntityToLinkGroupMapper.map(LINK_ENTITY);

        return LINK;
    }

    @LoggerMethodDecorator
    private validateId(groupLinkId: number): void {
        if (!groupLinkId || isNaN(Number(groupLinkId)) || groupLinkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_ID_ARGUMENT);
        }
    }
}
