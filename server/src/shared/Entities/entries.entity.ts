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

    @Column({ type: 'json' })
    votes: {
        value: number,
        up_voted: string[],
        down_voted: string[]
    }

    @Column({
        type: 'string',
        length: 17,
    })
    written_by: string

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.votes = {
            value: 0,
            up_voted: [],
            down_voted: []
        }
    }
}
