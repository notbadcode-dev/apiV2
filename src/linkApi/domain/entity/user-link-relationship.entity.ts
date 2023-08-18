import { GroupLinkEntity } from '@entity/group_link.entity';
import { LinkEntity } from '@entity/link.entity';
import { TagEntity } from '@entity/tag.entity';
import { UserEntity } from '@entity/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'auth.user' })
export class UserLinkRelationEntity extends UserEntity {
    @OneToMany(() => LinkEntity, (link) => link.userLinkRelation)
    linkList!: LinkEntity[];

    @OneToMany(() => GroupLinkEntity, (groupLink) => groupLink.user)
    groupLinkList!: GroupLinkEntity[];

    @OneToMany(() => TagEntity, (tag) => tag.user)
    tagList!: TagEntity[];

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
}
