import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class CategoriesEntity {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    parentCategory?: ObjectID

    @Column({
        type: 'varchar',
        length: 30,
    })
    name: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date
}
