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
import { createCipher, createDecipher } from 'crypto'

// Local files
import { configService } from '../Services/config.service'

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

    @AfterLoad()
    decryptMessage() {
        const key = createDecipher(configService.getEnv('ENCRYPTION_ALGORITHM'), configService.getEnv('ENCRYPTION_PASSWORD'))
        this.text = key.update(this.text, 'hex', 'utf8')
        this.text += key.final('utf8')
    }

    @BeforeInsert()
    encryptMessage() {
        const key = createCipher(configService.getEnv('ENCRYPTION_ALGORITHM'), configService.getEnv('ENCRYPTION_PASSWORD'))
        this.text = key.update(this.text, 'utf8', 'hex')
        this.text += key.final('hex')
    }
}
