import 'reflect-metadata';

import { LinkGroupEntity } from '@entity/link-group.entity';
import { LinkOrderEntity } from '@entity/link-order.entity';
import { LinkEntity } from '@entity/link.entity';
import { TagEntity } from '@entity/tag.entity';
import {
    LinkGroupRelationEntityToLinkGroupMapper,
    LINK_GROUP_RELATION_ENTITY_TO_LINK_GROUP_MAPPER,
} from '@mapper/link-group-relation/linkGroupRelationEntityToLinkGroup.mapper/linkGroupRelationEntityToLinkGroup.mapper';
import {
    LinkGroupEntityToLinkGroupMapper,
    LINK_GROUP_ENTITY_TO_LINK_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToLinkGroup.mapper/linkGroupEntityToLinkGroup.mapper';
import { LinkTagEntityToTagMapper, LINK_TAG_ENTITY_TO_TAG } from '@mapper/link-tag/linkTagEntityToTag.mapper/linkTagEntityToTag.mapper';
import { TagEntityToTagMapper, TAG_ENTITY_TO_TAG_MAPPER } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { ILinkGroup } from '@model/group/group-link.model';
import { ILink } from '@model/link/link.model';
import { Inject, Service, Token } from 'typedi';
import { ILinkEntityToLinkMapper } from '../linkToLinkEntity.mapper/linkToLinkEntity.mapper.interface';

export const LINK_ENTITY_TO_LINK_MAPPER = new Token<ILinkEntityToLinkMapper>('LinkEntityToLinkMapper');

@Service(LINK_ENTITY_TO_LINK_MAPPER)
export class LinkEntityToLinkMapper implements ILinkEntityToLinkMapper {
    constructor(
        @Inject(TAG_ENTITY_TO_TAG_MAPPER) private _tagEntityToTagMapper: TagEntityToTagMapper,
        @Inject(LINK_TAG_ENTITY_TO_TAG) private _linkTagEntityToTagMapper: LinkTagEntityToTagMapper,
        @Inject(LINK_GROUP_RELATION_ENTITY_TO_LINK_GROUP_MAPPER)
        private _linkGroupRelationEntityToLinkGroupMapper: LinkGroupRelationEntityToLinkGroupMapper,
        @Inject(LINK_GROUP_ENTITY_TO_LINK_GROUP_MAPPER) private _linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper
    ) {}

    public map(linkEntity: LinkEntity): ILink {
        const ORDER: number | null = this.getLinkOrderIndexByLinkEntityId(linkEntity?.id, linkEntity.linkOrderList);
        const TAG_ENTITY_LIST: TagEntity[] = this._linkTagEntityToTagMapper.mapByLinkEntityId(linkEntity.id, linkEntity.linkTagList);
        const LINK_GROUP_ENTITY: LinkGroupEntity | null = this._linkGroupRelationEntityToLinkGroupMapper.mapByLinkEntityId(
            linkEntity.id,
            linkEntity.linkGroupRelationList
        );
        const LINK_GROUP: ILinkGroup | null = this._linkGroupEntityToLinkGroupMapper.map(LINK_GROUP_ENTITY);

        const LINK: ILink = {
            id: linkEntity.id,
            name: linkEntity.name,
            url: linkEntity.url,
            favorite: linkEntity.favorite,
            active: linkEntity.active,
            order: ORDER,
            tagList: this._tagEntityToTagMapper.mapToList(TAG_ENTITY_LIST),
            linkGroupId: LINK_GROUP?.id ?? null,
            linkGroup: this._linkGroupEntityToLinkGroupMapper.map(LINK_GROUP_ENTITY),
        };

        return LINK;
    }

    private getLinkOrderIndexByLinkEntityId(linkEntityId: number, linkOrderList?: LinkOrderEntity[]): number {
        if (!linkEntityId || !linkOrderList || !linkOrderList?.length) {
            return 0;
        }

        const LINK_ORDER_LINK: LinkOrderEntity | null =
            linkOrderList?.find((linkOrder: LinkOrderEntity) => linkOrder.id === linkEntityId) ?? null;

        if (!LINK_ORDER_LINK) {
            return 0;
        }

        return LINK_ORDER_LINK?.orderIndex ?? 0;
    }
}
