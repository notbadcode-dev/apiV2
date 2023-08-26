import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { ILinkGroupEntityToGroupMapper } from '@mapper/link-group/linkGroupEntityToGroup/linkGroupEntityToGroup.mapper.interface';
import { IGroupLink } from '@model/group/group-link.model';
import { ILink } from '@model/link/link.model';
import { ITag } from '@model/tag/tag.model';
import { Service, Token } from 'typedi';

export const LINK_GROUP_ENTITY_TO_GROUP_MAPPER = new Token<ILinkGroupEntityToGroupMapper>('LinkGroupEntityToLinkGroupMapper');

@Service(LINK_GROUP_ENTITY_TO_GROUP_MAPPER)
export class LinkGroupEntityToGroupMapper implements ILinkGroupEntityToGroupMapper {
    public map(linkGroupEntity?: GroupLinkEntity | null): IGroupLink | null {
        if (!linkGroupEntity || !linkGroupEntity?.id || !linkGroupEntity?.name) {
            return null;
        }

        const LINK_LIST: ILink[] =
            linkGroupEntity?.linkList?.map((linkEntity: LinkEntity) => {
                return {
                    id: linkEntity.id,
                    name: linkEntity.name,
                    url: linkEntity.url,
                    favorite: linkEntity.favorite,
                    active: linkEntity.active,
                    displayOrder: linkEntity?.displayOrder ?? null,
                    tagList: linkEntity?.tagList ?? [],
                    linkGroupId: linkEntity.groupLinkId,
                };
            }) ?? [];

        let tagLinkList: ITag[] = new Array<ITag>();

        for (const LINK of LINK_LIST) {
            tagLinkList = [...tagLinkList, ...(LINK?.tagList ?? [])];
        }

        const LINK_GROUP: IGroupLink = {
            id: linkGroupEntity.id,
            name: linkGroupEntity.name,
            linkList: LINK_LIST,
            tagList: tagLinkList,
            colorFrom: linkGroupEntity.colorFrom,
            colorTo: linkGroupEntity.colorTo,
            gradientType: linkGroupEntity?.gradientType ?? GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK,
        };

        return LINK_GROUP;
    }
}
