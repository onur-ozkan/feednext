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
import { createHmac } from 'crypto'

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
        length: 20,
    })
    password: string

    @Column({
        type: 'string',
        length: 50,
        unique: true,
    })
    email: string

    @Column({
        type: 'string',
        length: 90,
    })
    link: string

    @Column({
        type: 'string',
        length: 155,
    })
    biography: string

    @Column({ type: 'string', nullable: true })
    refresh_token: string

    @Column({ type: 'tinyint' })
    role: number

    @Column({ type: 'boolean' })
    is_active: boolean

    @CreateDateColumn({ type: 'date' })
    created_at: Date

    @UpdateDateColumn({ type: 'date' })
    updated_at: Date

    @BeforeInsert()
    hashPassword() {
        this.password = createHmac('sha256', this.password).digest('hex')
    }

    @BeforeInsert()
    fillDefaults() {
        this.role = 0
        this.biography = ''
        this.link = ''
        this.is_active = true
    }
}
