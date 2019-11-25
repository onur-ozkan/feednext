import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'Products' })
export class ProductsEntity {
    constructor(partial: Partial<ProductsEntity>) {
        Object.assign(this, partial)
    }

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
