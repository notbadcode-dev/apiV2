import 'reflect-metadata';

import { GroupLinkEntity } from '@entity/group_link.entity';

import { LinkEntity } from '@entity/link.entity';
import {
    LinkGroupEntityToLinkGroupMapper,
    LINK_GROUP_ENTITY_TO_LINK_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToLinkGroup.mapper/linkGroupEntityToLinkGroup.mapper';
import { TagEntityToTagMapper, TAG_ENTITY_TO_TAG_MAPPER } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { ILinkGroup } from '@model/group/group-link.model';
import { ILink } from '@model/link/link.model';
import { Inject, Service, Token } from 'typedi';
import { ILinkEntityToLinkMapper } from './linkEntityToLink.mapper.interface';

export const LINK_ENTITY_TO_LINK_MAPPER = new Token<ILinkEntityToLinkMapper>('LinkEntityToLinkMapper');

@Service(LINK_ENTITY_TO_LINK_MAPPER)
export class LinkEntityToLinkMapper implements ILinkEntityToLinkMapper {
    constructor(
        @Inject(TAG_ENTITY_TO_TAG_MAPPER) private _tagEntityToTagMapper: TagEntityToTagMapper,
        @Inject(LINK_GROUP_ENTITY_TO_LINK_GROUP_MAPPER) private _linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper
    ) {}

    public map(linkEntity: LinkEntity): ILink {
        const LINK_GROUP_ENTITY: GroupLinkEntity | null = null;
        const LINK_GROUP: ILinkGroup | null = this._linkGroupEntityToLinkGroupMapper.map(LINK_GROUP_ENTITY);

        const LINK: ILink = {
            id: linkEntity.id,
            name: linkEntity.name,
            url: linkEntity.url,
            favorite: linkEntity.favorite,
            active: linkEntity.active,
            displayOrder: linkEntity.displayOrder,
            tagList: [],
            linkGroupId: LINK_GROUP?.id ?? null,
            linkGroup: this._linkGroupEntityToLinkGroupMapper.map(LINK_GROUP_ENTITY),
        };

        return LINK;
    }

    private getLinkOrderIndexByLinkEntityId(linkEntityId: number): number {
        if (!linkEntityId) {
            return 0;
        }

        return 0;
    }
}
