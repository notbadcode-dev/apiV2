import { UserEntity } from 'authApi/domain/entity/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GroupTagEntity } from './group-tag.entity';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { LinkGroupEntity } from './link-group.entity';
import { LinkOrderEntity } from './link-order.entity';
import { LinkTagEntity } from './link-tag.entity';
import { LinkEntity } from './link.entity';
import { TagEntity } from './tag.entity';

@Entity({ name: 'auth.user' })
export class UserLinkRelationEntity extends UserEntity {
    @OneToMany(() => LinkEntity, (link) => link.userLinkRelation)
    linkList!: LinkEntity[];

    @OneToMany(() => LinkGroupEntity, (groupLink) => groupLink.user)
    groupLinkList!: LinkGroupEntity[];

    @OneToMany(() => TagEntity, (tag) => tag.user)
    tagList!: TagEntity[];

    @OneToMany(() => LinkGroupRelationEntity, (linkGroup) => linkGroup.user)
    linkGroupList!: LinkGroupRelationEntity[];

    @OneToMany(() => GroupTagEntity, (groupTag) => groupTag.user)
    groupTagList!: GroupTagEntity[];

    @OneToMany(() => LinkOrderEntity, (linkOrder) => linkOrder.user)
    linkOrderList!: LinkOrderEntity[];

    @OneToMany(() => LinkTagEntity, (linkTag) => linkTag.user)
    linkTagList!: LinkTagEntity[];

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user!: UserEntity;
}
