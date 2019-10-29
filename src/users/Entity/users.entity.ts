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
    // tslint:disable-next-line:variable-name
    _id: ObjectID

    @Column({
        type: 'varchar',
        length: 50,
    })
    fullName: string

    @Column({
        type: 'varchar',
        length: 17,
        unique: true,
    })
    username: string

    @Column({
        type: 'varchar',
        length: 15,
    })
    password: string

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex')
    }

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
    })
    @IsEmail()
    email: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt?: Date

    @Column({ type: 'timestamp' })
    deletedAt?: Date
}
