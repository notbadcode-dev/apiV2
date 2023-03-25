import { EntityBase } from 'shared/entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LinkGroupEntity } from './link-group.entity';
import { LinkEntity } from './link.entity';
import { TagEntity } from './tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.link_tag' })
@Unique('unique_link_tag', ['user', 'link', 'tag'])
export class LinkTagEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'link_tag_id' })
    id!: number;

    @ManyToOne(() => LinkEntity, (link) => link.linkTagList)
    @JoinColumn({ name: 'link_id' })
    link!: LinkEntity;

    @ManyToOne(() => TagEntity, (tag) => tag.linkTagList)
    @JoinColumn({ name: 'tag_id' })
    tag!: TagEntity;

    @ManyToOne(() => LinkGroupEntity, (groupLink) => groupLink.linkTagList)
    @JoinColumn({ name: 'link_group_id' })
    group!: LinkGroupEntity;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.linkTagList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_user_id_tag_id')
    @Column({ name: 'user_id', nullable: false })
    userId!: number;
}
