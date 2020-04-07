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
import * as crypto from 'crypto'

@Entity('Users')
export class UsersEntity {
    constructor(partial: Partial<UsersEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column({
        type: 'string',
        length: 50,
    })
    full_name: string

    @Column({
        type: 'string',
        length: 17,
        unique: true,
    })
    username: string

    @Column({
        type: 'string',
        length: 15,
    })
    password: string

    @Column({
        type: 'string',
        length: 50,
        unique: true,
    })
    email: string

    @Column({ type: 'string', nullable: true })
    refresh_token: string

    @Column({ type: 'tinyint' })
    role: number

    @Column({ type: 'array' })
    up_voted_entries: string[]

    @Column({ type: 'array' })
    down_voted_entries: string[]

    @Column({ type: 'boolean' })
    is_verified: boolean

    @Column({ type: 'boolean' })
    is_active: boolean

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex')
    }

    @BeforeInsert()
    fillDefaults() {
        this.role = 0
        this.is_active = true
        this.is_verified = false,
        this.up_voted_entries = []
        this.down_voted_entries = []
    }
}
