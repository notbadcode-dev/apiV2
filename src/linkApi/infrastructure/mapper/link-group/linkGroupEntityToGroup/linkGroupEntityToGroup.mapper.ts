import { DEFAULT_GRADIENT_GROUP_LINK } from '@app/linkApi/infrastructure/constant/group-link.constant';
import { LinkGroupRelationEntity } from '@entity/link-group-relation.entity';
import { LinkGroupEntity } from '@entity/link-group.entity';
import { LinkEntityToLinkMapper, LINK_ENTITY_TO_LINK_MAPPER } from '@mapper/link/linkEntityToLink.mapper/linkEntityToLink.mapper';
import { IGroup } from '@model/group/group.model';
import { ILink } from '@model/link/link.model';
import { ITag } from '@model/tag/tag.model';
import { Inject, Service, Token } from 'typedi';
import { ILinkGroupEntityToGroupMapper } from './linkGroupEntityToGroup.mapper.interface';

export const LINK_GROUP_ENTITY_TO_GROUP_MAPPER = new Token<ILinkGroupEntityToGroupMapper>('LinkGroupEntityToLinkGroupMapper');

@Service(LINK_GROUP_ENTITY_TO_GROUP_MAPPER)
export class LinkGroupEntityToGroupMapper implements ILinkGroupEntityToGroupMapper {
    constructor(@Inject(LINK_ENTITY_TO_LINK_MAPPER) private _linkEntityToLinkMapper: LinkEntityToLinkMapper) {}

    public map(linkGroupEntity?: LinkGroupEntity | null): IGroup | null {
        if (!linkGroupEntity || !linkGroupEntity.id || !linkGroupEntity.name) {
            return null;
        }

        const LINK_LIST: ILink[] =
            linkGroupEntity?.linkGroupList?.map((linkGroupRelationEntity: LinkGroupRelationEntity) =>
                this._linkEntityToLinkMapper.map(linkGroupRelationEntity.link)
            ) ?? [];

        let tagLinkList: ITag[] = new Array<ITag>();

        for (const LINK of LINK_LIST) {
            tagLinkList = [...tagLinkList, ...(LINK?.tagList ?? [])];
        }

        const LINK_GROUP: IGroup = {
            id: linkGroupEntity.id,
            name: linkGroupEntity.name,
            linkList: LINK_LIST,
            tagList: tagLinkList,
            colorFrom: linkGroupEntity.colorFrom,
            colorTo: linkGroupEntity.colorTo,
            gradientType: linkGroupEntity.gradientType ?? DEFAULT_GRADIENT_GROUP_LINK,
        };

        return LINK_GROUP;
    }
}
