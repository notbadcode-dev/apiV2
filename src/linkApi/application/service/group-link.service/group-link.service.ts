import { ENTITY_CONSTANT } from '@constant/entity.constant';
import { ERROR_MESSAGE_GROUP_LINK } from '@constant/error-message/error-message-group-link.constant';
import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { LINK_CONSTANT } from '@constant/link.constant copy';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { ArgumentError } from '@error/argument.error';
import {
    LinkGroupEntityToGroupMapper,
    LINK_GROUP_ENTITY_TO_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { IDeleteGroup } from '@model/group/delete-group.model';

import { IGroup } from '@model/group/group.model';
import { ILink } from '@model/link/link.model';
import { IPaginateItem } from '@model/pagination-item/pagination-item.model';
import { GroupLinkRepository, GROUP_LINK_REPOSITORY_TOKEN } from '@repository/group-link.repository/group-link.repository';
import { LinkRepository, LINK_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import {
    GlobalUtilValidateService,
    GLOBAL_UTIL_VALIDATE_SERVICE,
} from '@service/global/global.util.validate.service/global.util.validate.service';
import { IGroupLinkService } from '@service/group-link.service/group-link.service.interface';
import { TokenService, TOKEN_SERVICE_TOKEN } from '@service/middleware/token.service/token.service';
import { Inject, Service, Token } from 'typedi';

export const GROUP_LINK_SERVICE_TOKEN = new Token<IGroupLinkService>('GroupLinkService');

@Service(GROUP_LINK_SERVICE_TOKEN)
export class GroupLinkService implements IGroupLinkService {
    constructor(
        @Inject(GROUP_LINK_REPOSITORY_TOKEN) private _groupLinkRepository: GroupLinkRepository,
        @Inject(LINK_GROUP_ENTITY_TO_GROUP_MAPPER) private _linkGroupEntityToGroupMapper: LinkGroupEntityToGroupMapper,
        @Inject(TOKEN_SERVICE_TOKEN) private _tokenService: TokenService,
        @Inject(LINK_REPOSITORY_TOKEN) private _linkRepository: LinkRepository,
        @Inject(GLOBAL_UTIL_VALIDATE_SERVICE) private _globalUtilValidateService: GlobalUtilValidateService
    ) {}

    @LoggerMethodDecorator
    public async createGroupLink(createGroupLink: IGroup): Promise<IGroup | null> {
        this.validateArgumentForCreateGroupLink(createGroupLink);

        const USER_ID: number = this._tokenService.getCurrentUserId();
        const LINK_GROUP_ENTITY: GroupLinkEntity = new GroupLinkEntity();

        LINK_GROUP_ENTITY.id = ENTITY_CONSTANT.CREATE_DEFAULT_ID;
        LINK_GROUP_ENTITY.name = createGroupLink.name;
        LINK_GROUP_ENTITY.colorFrom = createGroupLink?.colorFrom ?? GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        LINK_GROUP_ENTITY.colorTo = createGroupLink?.colorTo ?? GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK;
        LINK_GROUP_ENTITY.gradientType = createGroupLink?.gradientType ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        LINK_GROUP_ENTITY.userId = USER_ID;

        const GROUP_LINK_CREATED_SAVED = await this._groupLinkRepository.create(LINK_GROUP_ENTITY);

        if (createGroupLink?.linkList?.length) {
            const LINK_ENTITY_LIST = createGroupLink?.linkList.map((link: ILink, index: number) => {
                const LINK_ENTITY = new LinkEntity();
                LINK_ENTITY.id = ENTITY_CONSTANT.CREATE_DEFAULT_ID;
                LINK_ENTITY.name = link.name;
                LINK_ENTITY.url = link.url;
                LINK_ENTITY.favorite = link?.favorite ?? LINK_CONSTANT.DEFAULT_ACTIVE;
                LINK_ENTITY.active = link?.active ?? LINK_CONSTANT.DEFAULT_FAVORITE;
                LINK_ENTITY.groupLinkId = GROUP_LINK_CREATED_SAVED.id;
                LINK_ENTITY.userId = USER_ID;
                LINK_ENTITY.displayOrder = index + 1;
                return LINK_ENTITY;
            });
            await this._linkRepository.createList(LINK_ENTITY_LIST);
        }

        const GROUP_LINK_CREATED = await this._groupLinkRepository.getById(GROUP_LINK_CREATED_SAVED.id);
        const GROUP_LINK: IGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_CREATED) ?? null;
        return GROUP_LINK;
    }

    @LoggerMethodDecorator
    public async updateGroupLink(updateGroupLinkId: number, updateGroupLink: IGroup): Promise<IGroup | null> {
        this._globalUtilValidateService.controlSameIdOnParamAndBody(updateGroupLinkId, updateGroupLink.id);
        this.validateArgumentForUpdateGroupLink(updateGroupLink);

        const LINK_UPDATED: IGroup | null = await this.updaterGroupLink(updateGroupLink);
        return LINK_UPDATED;
    }

    @LoggerMethodDecorator
    public async deleteGroupLink(deleteGroupLink: IDeleteGroup): Promise<boolean> {
        this.validateId(deleteGroupLink.id);
        const DELETE_GROUP_LINK_ENTITY = await this._groupLinkRepository.getById(deleteGroupLink.id);
        const LINK_ENTITY_ID_LIST = DELETE_GROUP_LINK_ENTITY?.linkList?.map((LINK_ENTITY: LinkEntity) => LINK_ENTITY.id) ?? [];
        const SUCCESSFULLY_DELETE_LINK = await this._groupLinkRepository.delete(deleteGroupLink);

        if (SUCCESSFULLY_DELETE_LINK && deleteGroupLink.withLinkList) {
            await this._linkRepository.deleteList(LINK_ENTITY_ID_LIST);
        }

        return SUCCESSFULLY_DELETE_LINK;
    }

    @LoggerMethodDecorator
    public async getGroupLink(groupLinkId: number): Promise<IGroup | null> {
        this.validateId(groupLinkId);

        const GROUP_LINK_ENTITY = await this._groupLinkRepository.getById(groupLinkId);
        const GROUP_LINK: IGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_ENTITY);

        return GROUP_LINK;
    }

    @LoggerMethodDecorator
    public async getGroupLinkList(): Promise<(IGroup | null)[]> {
        const GROUP_LINK_ENTITY_LIST = await this._groupLinkRepository.getAll();
        const GROUP_LINK_LIST: (IGroup | null)[] = GROUP_LINK_ENTITY_LIST.map((GROUP_LINK_ENTITY: GroupLinkEntity) => {
            const GROUP_LINK = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_ENTITY);
            return GROUP_LINK;
        }).filter((group: IGroup | null) => group !== null);

        return GROUP_LINK_LIST;
    }

    @LoggerMethodDecorator
    public async getPaginateGroupLinkList(paginateGroupLinkList: IPaginateItem<IGroup>): Promise<IPaginateItem<IGroup | null>> {
        this._globalUtilValidateService.validatePaginate<IGroup>(paginateGroupLinkList);

        const PAGINATE_GROUP_LINK_ENTITY: IPaginateItem<GroupLinkEntity> = await this._groupLinkRepository.getAllPaginated(
            paginateGroupLinkList
        );
        const GROUP_LINK_LIST: (IGroup | null)[] =
            PAGINATE_GROUP_LINK_ENTITY?.itemList?.map((GROUP_LINK_ENTITY: GroupLinkEntity) =>
                this._linkGroupEntityToGroupMapper.map(GROUP_LINK_ENTITY)
            ) ?? [];

        const PAGINATE_LINK_LIST: IPaginateItem<IGroup | null> = {
            ...PAGINATE_GROUP_LINK_ENTITY,
            itemList: GROUP_LINK_LIST,
        };
        return PAGINATE_LINK_LIST;
    }

    @LoggerMethodDecorator
    private async updaterGroupLink(updateGroupLink: IGroup): Promise<IGroup | null> {
        const UPDATE_GROUP_LINK_ENTITY = await this._groupLinkRepository.getById(updateGroupLink.id);

        UPDATE_GROUP_LINK_ENTITY.name = updateGroupLink.name;
        UPDATE_GROUP_LINK_ENTITY.colorFrom = updateGroupLink?.colorFrom ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        UPDATE_GROUP_LINK_ENTITY.colorTo = updateGroupLink.colorTo ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;
        UPDATE_GROUP_LINK_ENTITY.gradientType = updateGroupLink.gradientType ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK;

        if (!UPDATE_GROUP_LINK_ENTITY.displayOrder) {
            UPDATE_GROUP_LINK_ENTITY.displayOrder = await this._groupLinkRepository.getNextDisplayOrder(UPDATE_GROUP_LINK_ENTITY.userId);
        }

        const GROUP_LINK_UPDATED = await this._groupLinkRepository.update(UPDATE_GROUP_LINK_ENTITY);
        const GROUP_LINK_MAPPED: IGroup | null = this._linkGroupEntityToGroupMapper.map(GROUP_LINK_UPDATED) ?? null;
        return GROUP_LINK_MAPPED;
    }

    @LoggerMethodDecorator
    private validateArgumentForCreateGroupLink(groupLinkCreate: IGroup): void {
        this.validateName(groupLinkCreate?.name?.trim());
    }

    @LoggerMethodDecorator
    private validateArgumentForUpdateGroupLink(groupUpdateLink: IGroup): void {
        this.validateId(groupUpdateLink?.id);
        this.validateName(groupUpdateLink?.name?.trim());
    }

    @LoggerMethodDecorator
    private validateName(groupLinkName?: string): void {
        if (!groupLinkName?.trim().length) {
            throw new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_NAME_ARGUMENT);
        }
    }

    @LoggerMethodDecorator
    private validateId(groupLinkId: number): void {
        if (!groupLinkId || isNaN(Number(groupLinkId)) || groupLinkId <= 0) {
            throw new ArgumentError(ERROR_MESSAGE_GROUP_LINK.WRONG_ID_ARGUMENT);
        }
    }
}
