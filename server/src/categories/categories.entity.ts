import { Column, Entity, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Category {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  parentCategory?: ObjectID;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt?: Date;
}
