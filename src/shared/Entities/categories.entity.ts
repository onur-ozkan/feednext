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

    @ObjectIdColumn({ nullable: true })
    parent_category: ObjectID

    @Column({ length: 30 })
    name: string

    @CreateDateColumn({})
    created_at: Date

    @UpdateDateColumn({})
    updated_at: Date
}
