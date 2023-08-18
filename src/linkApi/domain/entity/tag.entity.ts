import { TAG_CONSTANT } from '@constant/tag.constant';
import { EntityBase } from '@entity/base.entity';
import { LinkEntity } from '@entity/link.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'tag' })
export class TagEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'tag_id' })
    id!: number;

    @Column({ type: 'varchar', length: TAG_CONSTANT.TAG_MAX_LENGTH })
    name!: string;

    @ManyToOne(() => LinkEntity, (link) => link.tagList)
    link!: LinkEntity;

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.tagList)
    @JoinColumn({ name: 'user_id' })
    user!: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;
}
