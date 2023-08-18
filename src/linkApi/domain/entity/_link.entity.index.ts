import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { TagEntity } from '@entity/tag.entity';
import { UserLinkRelationEntity } from '@entity/user-link-relationship.entity';

/* eslint-disable @typescript-eslint/ban-types */
export const LINK_API_ENTITY_LIST: Function[] = [UserLinkRelationEntity, LinkEntity, GroupLinkEntity, TagEntity];
