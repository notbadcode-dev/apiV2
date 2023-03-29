import { EntityBase } from '@entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { LinkOrderEntity } from './link-order.entity';
import { LinkTagEntity } from './link-tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.link' })
export class LinkEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'link_id' })
    id!: number;

    @Column({ length: 250 })
    name!: string;

    @Column({ length: 250 })
    url!: string;

    @Column({ name: 'favorite', default: false })
    favorite!: boolean;

    @Column({ name: 'active', default: true })
    active!: boolean;

    @OneToMany(() => LinkGroupRelationEntity, (linkGroupRelation) => linkGroupRelation.link)
    linkGroupRelationList?: LinkGroupRelationEntity[];

    @OneToMany(() => LinkOrderEntity, (linkOrder) => linkOrder.link)
    linkOrderList?: LinkOrderEntity[];

    @OneToMany(() => LinkTagEntity, (linkTag) => linkTag.link)
    linkTagList?: LinkTagEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (userLinkRelation) => userLinkRelation.linkList, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    userLinkRelation?: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
