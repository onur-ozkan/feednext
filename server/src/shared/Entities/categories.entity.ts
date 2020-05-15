// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
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

    @Column({ type: 'string', length: 50 })
    name: string

    @Column('boolean')
    is_leaf: boolean

    @Column('array')
    ancestors: string[]

    @CreateDateColumn('date')
    created_at: Date

    @UpdateDateColumn('date')
    updated_at: Date
}
