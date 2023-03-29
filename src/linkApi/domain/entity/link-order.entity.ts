import { EntityBase } from '@entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LinkGroupEntity } from './link-group.entity';
import { LinkEntity } from './link.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.link_order' })
@Unique('unique_link_order', ['user', 'link'])
export class LinkOrderEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'link_order_id' })
    id!: number;

    @Column({ name: 'order_index' })
    orderIndex!: number;

    @ManyToOne(() => LinkEntity, (link) => link.linkOrderList)
    @JoinColumn({ name: 'link_id' })
    link!: LinkEntity;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.linkOrderList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @ManyToOne(() => LinkGroupEntity, (groupLink) => groupLink.linkOrderList)
    @JoinColumn({ name: 'group_id' })
    group?: LinkGroupEntity;

    @Index('ix_user_id_order_index')
    @Column({ name: 'user_id' })
    userId!: number;
}
