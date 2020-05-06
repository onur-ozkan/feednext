// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('Messages')
export class MessagesEntity {
    constructor(partial: Partial<MessagesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column({ type: 'string' })
    conversation_id: string

    @Column({ type: 'string', length: 255 })
    text: string

    @Column({ type: 'string', length: 17 })
    send_by: string

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date
}
