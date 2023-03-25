import { EntityBase } from 'shared/entity/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line hexagonal-architecture/enforce
import { UserApplicationEntity } from './user-application.entity';

@Entity({ name: 'auth.application' })
export class ApplicationEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'application_id' })
    id!: number;

    @Column({ name: 'application_name', type: 'varchar', length: 100, nullable: false })
    applicationName!: string;

    @OneToMany(() => UserApplicationEntity, (userApplication) => userApplication.application)
    userApplicationList!: UserApplicationEntity[];
}
