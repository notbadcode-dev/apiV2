import { EntityBase } from 'shared/entity/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupTagEntity } from './group-tag.entity';
import { LinkTagEntity } from './link-tag.entity';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link.tag' })
export class TagEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'tag_id' })
    id!: number;

    @Column({ type: 'varchar', length: 250, nullable: false })
    name!: string;

    @OneToMany(() => LinkTagEntity, (linkTags) => linkTags.tag)
    linkTagList!: LinkTagEntity[];

    @OneToMany(() => GroupTagEntity, (groupTag) => groupTag.tag)
    groupTagList!: GroupTagEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.tagList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_tag_id_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
