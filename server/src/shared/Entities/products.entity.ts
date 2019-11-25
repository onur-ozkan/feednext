import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class ProductsEntity {
    @ObjectIdColumn()
    id: ObjectID

    @ObjectIdColumn()
    category_id: ObjectID

    @Column({
        type: 'varchar',
        length: 60,
    })
    name: string

    @CreateDateColumn({})
    created_at: Date

    @UpdateDateColumn({})
    updated_at: Date
}
