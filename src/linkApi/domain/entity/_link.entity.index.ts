import { GroupTagEntity } from './group-tag.entity';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { LinkGroupEntity } from './link-group.entity';
import { LinkOrderEntity } from './link-order.entity';
import { LinkTagEntity } from './link-tag.entity';
import { LinkEntity } from './link.entity';
import { TagEntity } from './tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

/* eslint-disable @typescript-eslint/ban-types */
export const LINK_API_ENTITY_LIST: Function[] = [
    UserLinkRelationEntity,
    LinkEntity,
    LinkGroupEntity,
    LinkGroupRelationEntity,
    TagEntity,
    LinkTagEntity,
    GroupTagEntity,
    LinkOrderEntity,
];
