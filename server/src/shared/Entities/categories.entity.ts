// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn
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

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date
}
