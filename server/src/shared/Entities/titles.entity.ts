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

@Entity(`Titles`)
export class TitlesEntity {
    constructor(partial: Partial<TitlesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    category_id: string

    @Column({
        unique: true,
        type: `varchar`,
        length: 60,
    })
    name: string

    @Column({ type: 'tinyint' })
    rate: number

    @Column()
    entry_count: number

    @Column({
        type: `varchar`,
        length: 17,
    })
    opened_by: string

    @Column({
        type: `varchar`,
        length: 17,
    })
    updated_by: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.rate = 0
        this.entry_count = 0
    }
}
