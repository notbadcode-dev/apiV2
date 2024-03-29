import { LinkEntity } from '@entity/link.entity';
import {
    LinkGroupEntityToGroupMapper,
    LINK_GROUP_ENTITY_TO_GROUP_MAPPER,
} from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper';
import { ILinkEntityToLinkMapper } from '@mapper/link/linkEntityToLink.mapper/linkEntityToLink.mapper.interface';
import { TagEntityToTagMapper, TAG_ENTITY_TO_TAG_MAPPER } from '@mapper/tag/tagEntityToTag.mapper/tagEntityToTag.mapper';
import { ILink } from '@model/link/link.model';
import { Inject, Service, Token } from 'typedi';

export const LINK_ENTITY_TO_LINK_MAPPER = new Token<ILinkEntityToLinkMapper>('LinkEntityToLinkMapper');

@Service(LINK_ENTITY_TO_LINK_MAPPER)
export class LinkEntityToLinkMapper implements ILinkEntityToLinkMapper {
    constructor(
        @Inject(LINK_GROUP_ENTITY_TO_GROUP_MAPPER) private _linkGroupEntityToLinkGroupMapper: LinkGroupEntityToGroupMapper,
        @Inject(TAG_ENTITY_TO_TAG_MAPPER) private _tagEntityToTagMapper: TagEntityToTagMapper
    ) {}

    public map(linkEntity: LinkEntity): ILink {
        const LINK: ILink = {
            id: linkEntity.id,
            name: linkEntity.name,
            url: linkEntity.url,
            favorite: linkEntity.favorite,
            active: linkEntity.active,
            displayOrder: linkEntity?.displayOrder ?? null,
            tagList: this._tagEntityToTagMapper.mapToList(linkEntity?.tagList),
            linkGroupId: linkEntity.groupLinkId,
            linkGroup: this._linkGroupEntityToLinkGroupMapper.map(linkEntity.groupLink),
        };

        return LINK;
    }
}
