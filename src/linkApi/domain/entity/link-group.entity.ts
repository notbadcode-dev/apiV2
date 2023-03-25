import { EntityBase } from 'shared/entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupLinkGradientType } from '../../../shared/enum/group-link-gradient-type.enum';
import { GroupTagEntity } from './group-tag.entity';
import { LinkGroupRelationEntity } from './link-group-relation.entity';
import { LinkOrderEntity } from './link-order.entity';
import { LinkTagEntity } from './link-tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.group_link' })
export class LinkGroupEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'link_group_id' })
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ name: 'color1', type: 'char', length: 9 })
    colorFrom!: string;

    @Column({ name: 'color2', type: 'char', length: 9 })
    colorTo!: string;

    @Column({ type: 'enum', enum: GroupLinkGradientType })
    gradientType!: string;

    @OneToMany(() => LinkGroupRelationEntity, (linkGroup) => linkGroup.group)
    linkGroupList!: LinkGroupRelationEntity[];

    @OneToMany(() => LinkTagEntity, (linkTag) => linkTag.group)
    linkTagList!: LinkTagEntity[];

    @OneToMany(() => GroupTagEntity, (groupTag) => groupTag.group)
    groupTagList!: GroupTagEntity[];

    @OneToMany(() => LinkOrderEntity, (groupTag) => groupTag.group)
    linkOrderList!: GroupTagEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.groupLinkList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
