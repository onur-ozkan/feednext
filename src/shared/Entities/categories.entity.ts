import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm'

@Entity('Categories')
export class CategoriesEntity {
    constructor(partial: Partial<CategoriesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column({ nullable: true })
    parent_category: string

    @Column({ length: 50, unique: true })
    name: string

    @Column({})
    is_lowest_cateogry: boolean

    @BeforeInsert()
    fillDefaults() {
        this.is_lowest_cateogry = false
    }

    @CreateDateColumn({})
    created_at: Date

    @UpdateDateColumn({})
    updated_at: Date
}
