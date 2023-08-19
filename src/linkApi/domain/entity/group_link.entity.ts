import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { API_LINK_CONSTANT } from '@constant/link-api.constant';
import { EntityBase } from '@entity/base.entity';
import { LinkEntity } from '@entity/link.entity';
import { EGroupLinkGradientType } from '@enum/group-link-gradient-type.enum';
import { LINK_GROUP_ENTITY } from '@repository/group-link.repository/group-link.repository';
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

@Entity({ name: 'group_link' })
export class GroupLinkEntity extends EntityBase {
    @PrimaryGeneratedColumn({ name: 'group_link_id' })
    id!: number;

    @Column({ type: 'varchar', length: API_LINK_CONSTANT.LONG_TEXT_MAX_LENGTH })
    name!: string;

    @Column({
        name: 'color1',
        type: 'char',
        length: GROUP_LINK_CONSTANT.COLOR_MAX_LENGTH,
        default: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
    })
    colorFrom!: string;

    @Column({
        name: 'color2',
        type: 'char',
        length: GROUP_LINK_CONSTANT.COLOR_MAX_LENGTH,
        default: GROUP_LINK_CONSTANT.DEFAULT_COLOR_GROUP_LINK,
    })
    colorTo!: string;

    @Column({ name: 'gradient_type', type: 'enum', enum: EGroupLinkGradientType, default: GROUP_LINK_CONSTANT.DEFAULT_GRADIENT_GROUP_LINK })
    gradientType!: string;

    @Column({ name: 'display_order', type: 'int', nullable: true, default: null })
    displayOrder?: number;

    @OneToMany(() => LinkEntity, (link) => link.groupLink)
    linkList?: LinkEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.groupLinkList)
    @JoinColumn({ name: 'user_id' })
    user?: UserLinkRelationEntity;

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
        if (this.displayOrder === null || this.displayOrder === undefined) {
            const LINK_REPOSITORY: Repository<GroupLinkEntity> = Container.get(LINK_GROUP_ENTITY);

            const MAX_DISPLAY_ORDER = await LINK_REPOSITORY.createQueryBuilder('link')
                .select('MAX(link.displayOrder)', 'maxDisplayOrder')
                .where('link.userId = :userId', { userId: this.userId })
                .getRawOne();

            const NEXT_DISPLAY_ORDER = (MAX_DISPLAY_ORDER.maxDisplayOrder || 0) + 1;
            this.displayOrder = NEXT_DISPLAY_ORDER;
        }
    }
}
