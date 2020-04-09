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

@Entity('Entries')
export class EntriesEntity {
    constructor(partial: Partial<EntriesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column({ type: 'string' })
    title_id: string

    @Column({ type: 'string' })
    text: string

    @Column({ type: 'int' })
    votes: number

    @Column({
        type: 'string',
        length: 17,
    })
    written_by: string

    @Column({
        type: 'string',
        length: 17,
    })
    updated_by: string

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.votes = 0
    }
}
