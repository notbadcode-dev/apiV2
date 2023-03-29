import { EntityBase } from '@entity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// eslint-disable-next-line hexagonal-architecture/enforce
import { ApplicationEntity } from './application.entity';
import { UserEntity } from './user.entity';

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
