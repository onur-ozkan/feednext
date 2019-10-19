import { Column, Entity, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
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

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt?: Date;

  @Column({ type: 'timestamp' })
  deletedAt?: Date;
}
