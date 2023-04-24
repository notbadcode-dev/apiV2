import { EntityBase } from '@entity/base.entity';
import { PasswordService } from '@service/password.service';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// eslint-disable-next-line hexagonal-architecture/enforce
import { UserApplicationEntity } from './user-application.entity';

@Entity({ name: 'auth.user' })
export class UserEntity extends EntityBase {
    @PrimaryGeneratedColumn('increment', { name: 'user_id' })
    id!: number;

    @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
    username!: string;

    @Column({ name: 'password', type: 'varchar', length: 64 })
    password!: string;

    @OneToMany(() => UserApplicationEntity, (userApplication) => userApplication.user)
    applicationList?: UserApplicationEntity[];

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        const PASSWORD_SERVICE: PasswordService = new PasswordService();
        this.password = await PASSWORD_SERVICE.hashPassword(this.password);
    }
}
