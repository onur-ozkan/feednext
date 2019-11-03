import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Product {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    categoryId: ObjectID

    @Column({
        type: 'varchar',
        length: 150,
    })
    name: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date

    @Column({ type: 'timestamp' })
    deletedAt?: Date
}
