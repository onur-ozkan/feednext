import { Column, Entity, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Unique, BeforeInsert } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';

@Entity({name: 'Users'})
@Unique(['username', 'email'])
export class UserEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    type: 'varchar',
    length: 50,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 17,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 15,
  })
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @Column({
    type: 'varchar',
    length: 50,
  })
  @IsEmail()
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt?: Date;

  @Column({ type: 'timestamp' })
  deletedAt?: Date;
}
