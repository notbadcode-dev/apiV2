import { TAG_CONSTANT } from '@constant/tag.constant';
import { EntityBase } from '@entity/base.entity';
import { LinkEntity } from '@entity/link.entity';
import { UserLinkRelationEntity } from '@entity/user-link-relationship.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tag' })
export class TagEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'tag_id' })
    id!: number;

    @Column({ type: 'varchar', length: TAG_CONSTANT.TAG_MAX_LENGTH })
    name!: string;

    @Index('ix_link_id')
    @Column({ name: 'link_id' })
    linkId!: number;

    @ManyToOne(() => LinkEntity, (link) => link.tagList)
    @JoinColumn({ name: 'link_id' })
    link!: LinkEntity;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.tagList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
