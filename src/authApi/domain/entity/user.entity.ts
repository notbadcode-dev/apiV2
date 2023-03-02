import { EntityBase } from 'shared/entity/base.entity';
import { PasswordService } from 'shared/service/password.service';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// eslint-disable-next-line hexagonal-architecture/enforce
import { UserApplicationEntity } from './user-application.entity';

@Entity({ name: 'user' })
export class UserEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'user_id' })
    id!: number;

    @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
    username!: string;

    @Column({ name: 'password', type: 'varchar', length: 250 })
    password!: string;

    @OneToMany(() => UserApplicationEntity, (userApplication) => userApplication.user)
    applicationList?: UserApplicationEntity[];

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const passwordService: PasswordService = new PasswordService();
        this.password = await passwordService.hashPassword(this.password);
    }
}
