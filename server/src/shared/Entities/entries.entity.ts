import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class EntriesEntity {
    @ObjectIdColumn()
    id: ObjectID

    @ObjectIdColumn()
    product_id: ObjectID

    @Column({
        type: 'varchar',
        length: 255,
    })
    entry: string

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
