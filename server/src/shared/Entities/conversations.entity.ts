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

    @Column('json')
    unread_messages: {
        [participantName: string]: number
    }

    @CreateDateColumn('date')
    created_at: Date

    @UpdateDateColumn('date')
    updated_at: Date

    @Column('date')
    last_message_send_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.unread_messages = {
            [this.participants[0]]: 0,
            [this.participants[1]]: 0,
        }
        this.last_message_send_at = new Date()
    }
}
