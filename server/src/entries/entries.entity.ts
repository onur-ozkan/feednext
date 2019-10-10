import { Column, Entity, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Entry {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  productId: ObjectID;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  entry: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  writtenBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt?: Date;
}
