import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'Entries' })
export class EntriesEntity {
    constructor(partial: Partial<EntriesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @ObjectIdColumn()
    product_id: ObjectID

    @Column({})
    text: string

    @Column({
        type: 'varchar',
        length: 17,
    })
    written_by: string

    @CreateDateColumn({})
    created_at: Date

    @UpdateDateColumn({})
    updated_at: Date
}
