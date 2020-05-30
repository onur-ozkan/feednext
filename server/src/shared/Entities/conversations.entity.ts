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

@Entity('Conversations')
export class ConversationsEntity {
    constructor(partial: Partial<ConversationsEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column('array')
    participants: string[]

    @Column('array')
    unread_messages:[
        { username: string, value: number },
        { username: string, value: number }
    ]

    @Column('array')
    deleted_from: string[]

    @CreateDateColumn('date')
    created_at: Date

    @UpdateDateColumn('date')
    updated_at: Date

    @Column('date')
    last_message_send_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.unread_messages = [
            { username: this.participants[0], value: 0 },
            { username: this.participants[1], value: 0 }
        ]
        this.deleted_from = []
        this.last_message_send_at = new Date()
    }
}
