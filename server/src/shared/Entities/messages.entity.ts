// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    AfterLoad,
    BeforeInsert
} from 'typeorm'
import { createCipheriv, createDecipheriv } from 'crypto'

// Local files
import { configService, } from '../Services/config.service'

@Entity('Messages')
export class MessagesEntity {
    constructor(partial: Partial<MessagesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column({ type: 'string' })
    conversation_id: string

    @Column({ type: 'string', length: 500 })
    text: string

    @Column({ type: 'string', length: 17 })
    send_by: string

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @AfterLoad()
    decryptMessage() {
        const decipher = createDecipheriv(
            configService.getEnv('ENCRYPTION_ALGORITHM'),
            Buffer.from(configService.getEnv('ENCRYPTION_KEY')),
            configService.getEnv('ENCRYPTION_IV')
        )

        this.text = decipher.update(this.text, 'hex', 'utf8') + decipher.final('utf8')
    }

    @BeforeInsert()
    encryptMessage() {
        const cipher = createCipheriv(
            configService.getEnv('ENCRYPTION_ALGORITHM'),
            Buffer.from(configService.getEnv('ENCRYPTION_KEY')),
            configService.getEnv('ENCRYPTION_IV')
        )

        this.text = cipher.update(this.text, 'utf8', 'hex') + cipher.final('hex')
    }
}
