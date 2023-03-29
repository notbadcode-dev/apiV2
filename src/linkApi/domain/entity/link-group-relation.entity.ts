import { EntityBase } from '@entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LinkGroupEntity } from './link-group.entity';
import { LinkEntity } from './link.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.link_group' })
@Unique('unique_link_group', ['user', 'link', 'group'])
export class LinkGroupRelationEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'link_group_relation_id' })
    id!: number;

    @Column({ name: 'order_index', type: 'int' })
    order_index!: number;

    @ManyToOne(() => LinkEntity, (link) => link.linkGroupRelationList)
    @JoinColumn({ name: 'link_id' })
    link!: LinkEntity;

    @ManyToOne(() => LinkGroupEntity, (groupLink) => groupLink.linkGroupList)
    group!: LinkGroupEntity;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.linkGroupList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_user_id_order_index')
    @Column({ name: 'user_id' })
    userId!: number;
}
