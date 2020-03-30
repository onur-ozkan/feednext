// Other dependencies
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
    id: ObjectID

    @Column({ type: 'string', nullable: true })
    parent_category: string

    @Column({ type: 'string', length: 50, unique: true})
    name: string

    @Column({ type: 'boolean' })
    is_lowest_cateogry: boolean

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.is_lowest_cateogry = false
    }
}
