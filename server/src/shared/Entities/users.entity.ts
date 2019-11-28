import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm'
import { IsEmail } from 'class-validator'
import * as crypto from 'crypto'

@Entity({ name: 'Users' })
export class UsersEntity {
    constructor(partial: Partial<UsersEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column({
        length: 50,
    })
    full_name: string

    @Column({
        length: 17,
        unique: true,
    })
    username: string

    @Column({
        length: 15,
    })
    password: string

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex')
    }

    @Column({
        length: 50,
        unique: true,
    })
    @IsEmail()
    email: string

    @Column({type: 'tinyint'})
    role: number

    @Column()
    is_verified: boolean

    @Column()
    is_active: boolean

    @BeforeInsert()
    fillDefaults() {
        this.role = 0
        this.is_active = true
        this.is_verified = false
    }

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
