import { Column, Entity } from 'typeorm';

@Entity()
export class EntityBase {
    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
    createdAt?: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', select: false })
    updatedAt?: Date;
}
