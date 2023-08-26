// eslint-disable-next-line hexagonal-architecture/enforce
import { ApplicationEntity } from '@entity/application.entity';
import { EntityBase } from '@entity/base.entity';
import { UserEntity } from '@entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth.user_application' })
export class UserApplicationEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'user_application_id' })
    id!: number;

    @ManyToOne(() => UserEntity, (user) => user.applicationList)
    user!: UserEntity;

    @ManyToOne(() => ApplicationEntity, (application) => application.userApplicationList)
    application!: ApplicationEntity;

    @Column({ type: 'timestamp', nullable: true })
    lastAccessed_at!: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    deactivated_at!: Date | null;
}
