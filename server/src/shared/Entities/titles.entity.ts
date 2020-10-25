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

@Entity('Titles')
export class TitlesEntity {
    constructor(partial: Partial<TitlesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column({ type: 'array' })
    tags: string[]

    @Column({
        unique: true,
        type: 'string',
        length: 60,
    })
    name: string

    @Column({ type: 'string' })
    slug: string

    @Column({ type: 'array' })
    rate: []

    @Column({ type: 'int' })
    entry_count: number

    @Column({
        type: 'string',
        length: 17,
    })
    opened_by: string

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
        this.rate = []
        this.entry_count = 0
    }
}
