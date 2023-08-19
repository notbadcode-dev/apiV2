import { API_LINK_CONSTANT } from '@constant/link-api.constant';
import { LINK_CONSTANT } from '@constant/link.constant copy';
import { EntityBase } from '@entity/base.entity';
import { GroupLinkEntity } from '@entity/group_link.entity';
import { TagEntity } from '@entity/tag.entity';
import { BooleanTransformer } from '@entity/transformer-boolean.class';
import { LINK_ENTITY_REPOSITORY_TOKEN } from '@repository/link.repository/link.repository';
import Container from 'typedi';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Repository,
} from 'typeorm';
import { UserLinkRelationEntity } from './user-link-relationship.entity';

@Entity({ name: 'link' })
export class LinkEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'link_id' })
    id!: number;

    @Column({ name: 'group_link_id', nullable: true, default: null })
    groupLinkId?: number;

    @Column({ type: 'varchar', length: API_LINK_CONSTANT.MEDIUM_TEXT_MAX_LENGTH })
    name!: string;

    @Column({ type: 'varchar', length: API_LINK_CONSTANT.LONG_TEXT_MAX_LENGTH })
    url!: string;

    @Column({ type: 'tinyint', default: LINK_CONSTANT.DEFAULT_FAVORITE, transformer: new BooleanTransformer() })
    favorite!: boolean;

    @Column({ type: 'tinyint', default: LINK_CONSTANT.DEFAULT_ACTIVE, transformer: new BooleanTransformer() })
    active!: boolean;

    @Column({ name: 'display_order', type: 'int', nullable: true, default: null })
    displayOrder?: number | null;

    @OneToMany(() => TagEntity, (tag) => tag.link)
    tagList?: TagEntity[];

    @ManyToOne(() => GroupLinkEntity, (groupLink) => groupLink.linkList)
    @JoinColumn({ name: 'group_link_id' })
    groupLink?: GroupLinkEntity;

    @ManyToOne(() => UserLinkRelationEntity, (userLinkRelation) => userLinkRelation.linkList, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    userLinkRelation?: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;

    @BeforeUpdate()
    async beforeUpdateActions(): Promise<void> {
        await this.setDefaultDisplayOrder();
    }

    @BeforeInsert()
    async beforeInsertActions(): Promise<void> {
        await this.setDefaultDisplayOrder();
    }

    private async setDefaultDisplayOrder(): Promise<void> {
        if (!this.displayOrder) {
            if (!this.groupLink) {
                this.setDefaultDisplayOrderOutGroup();
            } else {
                this.setDefaultDisplayOrderOnGroup();
            }
        }
    }

    private async setDefaultDisplayOrderOnGroup(): Promise<void> {
        const LINK_REPOSITORY: Repository<LinkEntity> = Container.get(LINK_ENTITY_REPOSITORY_TOKEN);

        const MAX_DISPLAY_ORDER = await LINK_REPOSITORY.createQueryBuilder('link')
            .select('MAX(link.displayOrder)', 'maxDisplayOrder')
            .where('link.userId = :userId', { userId: this.userId })
            .where('link.groupLinkId = :groupLinkId', { groupLinkId: this.groupLinkId })
            .getRawOne();

        const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
        this.displayOrder = NEXT_DISPLAY_ORDER;
    }

    private async setDefaultDisplayOrderOutGroup(): Promise<void> {
        const LINK_REPOSITORY: Repository<LinkEntity> = Container.get(LINK_ENTITY_REPOSITORY_TOKEN);

        const MAX_DISPLAY_ORDER = await LINK_REPOSITORY.createQueryBuilder('link')
            .select('MAX(link.displayOrder)', 'maxDisplayOrder')
            .where('link.userId = :userId', { userId: this.userId })
            .getRawOne();

        const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
        this.displayOrder = NEXT_DISPLAY_ORDER;
    }
}
