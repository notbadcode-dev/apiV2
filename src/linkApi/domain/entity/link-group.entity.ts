import { DEFAULT_COLOR_GROUP_LINK, DEFAULT_GRADIENT_GROUP_LINK } from '@constant/group-link.constant';
import { EntityBase } from '@entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EGroupLinkGradientType } from '../../../../src/shared/enum/group-link-gradient-type.enum';
import { GroupTagEntity } from './group-tag.entity';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { LinkOrderEntity } from './link-order.entity';
import { LinkTagEntity } from './link-tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.link_group' })
export class LinkGroupEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'link_group_id' })
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ name: 'color1', type: 'char', length: 9, default: DEFAULT_COLOR_GROUP_LINK, nullable: true })
    colorFrom!: string;

    @Column({ name: 'color2', type: 'char', length: 9, default: DEFAULT_COLOR_GROUP_LINK, nullable: true })
    colorTo!: string;

    @Column({ name: 'gradient_type', type: 'enum', enum: EGroupLinkGradientType, default: DEFAULT_GRADIENT_GROUP_LINK, nullable: false })
    gradientType!: EGroupLinkGradientType;

    @OneToMany(() => LinkGroupRelationEntity, (linkGroup) => linkGroup.group)
    linkGroupList?: LinkGroupRelationEntity[];

    @OneToMany(() => LinkTagEntity, (linkTag) => linkTag.group)
    linkTagList?: LinkTagEntity[];

    @OneToMany(() => GroupTagEntity, (groupTag) => groupTag.group)
    groupTagList?: GroupTagEntity[];

    @OneToMany(() => LinkOrderEntity, (linkOrder) => linkOrder.group)
    linkOrderList?: LinkOrderEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.groupLinkList)
    @JoinColumn({ name: 'user_id' })
    user?: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
