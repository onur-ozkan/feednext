// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('Tags')
export class TagsEntity {
    constructor(partial: Partial<TagsEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column({ type: 'string' })
    name: string

    @Column({ type: 'int' })
    total_title: number

    @Column({ type: 'double' })
    popularity_ratio: number

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date
}