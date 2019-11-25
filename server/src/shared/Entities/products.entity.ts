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

    @Column({ nullable: true })
    category_id: string

    @Column({
        type: 'varchar',
        length: 60,
    })
    name: string

    @Column({
        type: 'varchar',
        length: 17,
    })
    opened_by: string

    @CreateDateColumn({})
    created_at: Date

    @UpdateDateColumn({})
    updated_at: Date
}
