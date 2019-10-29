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
export class UserEntity {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    _id: ObjectID

    @Column({
        length: 50,
    })
    fullName: string

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

    @Column({})
    isVerified: boolean

    @Column({})
    isActive: boolean

    @BeforeInsert()
    fillDefaults() {
        this.isActive = true
        this.isVerified = false
    }

    @CreateDateColumn({})
    createdAt: Date

    @UpdateDateColumn({})
    updatedAt: Date
}
