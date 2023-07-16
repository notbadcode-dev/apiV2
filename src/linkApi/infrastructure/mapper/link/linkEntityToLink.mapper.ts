import 'reflect-metadata';

import { LinkGroupRelationEntityToLinkGroupMapper } from '@app/linkApi/infrastructure/mapper/link-group-relation/linkGroupRelationEntityToLinkGroup.mapper';
import { LinkGroupEntityToLinkGroupMapper } from '@app/linkApi/infrastructure/mapper/link-group/linkGroupEntityToLinkGroup.mapper';
import { LinkTagEntityToTagEntityMapper } from '@app/linkApi/infrastructure/mapper/link-tag/linkTagEntityToTagEntity.mapper';
import { TagEntityToTagMapper } from '@app/linkApi/infrastructure/mapper/tag/tagEntityToTag.mapper';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { LinkOrderEntity } from '@entity/link-order.entity';
import { LinkEntity } from '@entity/link.entity';
import { TagEntity } from '@entity/tag.entity';
import { ILinkGroup } from '@model/group/group-link.model';
import { ILink } from '@model/link/link.model';
import { Inject, Service } from 'typedi';

@Service()
export class LinkEntityToLinkMapper {
    constructor(
        @Inject() private _tagEntityToTagMapper: TagEntityToTagMapper,
        @Inject() private _linkTagEntityToTagEntityMapper: LinkTagEntityToTagEntityMapper,
        @Inject() private _linkGroupRelationEntityToLinkGroupMapper: LinkGroupRelationEntityToLinkGroupMapper,
        @Inject() private _linkGroupEntityToLinkGroupMapper: LinkGroupEntityToLinkGroupMapper
    ) {}

    public map(linkEntity: LinkEntity): ILink {
        const ORDER: number | null = this.getLinkOrderIndexByLinkEntityId(linkEntity?.id, linkEntity.linkOrderList);
        const TAG_ENTITY_LIST: TagEntity[] = this._linkTagEntityToTagEntityMapper.mapByLinkEntityId(linkEntity.id, linkEntity.linkTagList);
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