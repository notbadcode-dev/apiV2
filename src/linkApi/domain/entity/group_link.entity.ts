import { GROUP_LINK_CONSTANT } from '@constant/group-link.constant';
import { API_LINK_CONSTANT } from '@constant/link-api.constant';
import { EntityBase } from '@entity/base.entity';
import { LinkEntity } from '@entity/link.entity';
import { UserLinkRelationEntity } from '@entity/user-link-relationship.entity';
import { EGroupLinkGradientType } from '@enum/group-link-gradient-type.enum';
import { GROUP_LINK_REPOSITORY_TOKEN } from '@repository/group-link.repository/group-link.repository';
import { IGroupLinkRepository } from '@repository/group-link.repository/group-link.repository.interface';
import { LoggerMethodDecorator } from '@service/decorator/logger-method.decorator';
import Container from 'typedi';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    displayOrder?: number | null;

    @OneToMany(() => LinkEntity, (link) => link.groupLink)
    linkList?: LinkEntity[];

    @ManyToOne(() => UserLinkRelationEntity, (user) => user.groupLinkList)
    @JoinColumn({ name: 'user_id' })
    user?: UserLinkRelationEntity;

    @Index('ix_user_id')
    @Column({ name: 'user_id' })
    userId!: number;

    @LoggerMethodDecorator
    @BeforeInsert()
    async beforeInsertActions(): Promise<void> {
        await this.setDefaultDisplayOrder();
    }

    private async setDefaultDisplayOrder(): Promise<void> {
        if (!this.displayOrder) {
            const GROUP_LINK_REPOSITORY: IGroupLinkRepository = Container.get(GROUP_LINK_REPOSITORY_TOKEN);
            const NEXT_DISPLAY_ORDER: number | null = await GROUP_LINK_REPOSITORY.getNextDisplayOrder(this.userId);
            this.displayOrder = NEXT_DISPLAY_ORDER;
        }
    }
}
