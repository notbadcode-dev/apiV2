import { EntityBase } from 'shared/entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { TagEntity } from './tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.group_tags' })
@Unique('unique_group_tag', ['user', 'group', 'tag'])
export class GroupTagEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id!: number;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.groupTagList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @ManyToOne(() => LinkGroupRelationEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group!: LinkGroupRelationEntity;

    @ManyToOne(() => TagEntity, (tag) => tag.groupTagList)
    @JoinColumn({ name: 'tag_id' })
    tag!: TagEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
