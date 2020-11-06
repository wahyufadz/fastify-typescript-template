import dayjs from 'dayjs';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class BasicEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  updatedAt: string;

  @Column('timestamp')
  createdAt: string;

  @BeforeInsert()
  insert() {
    this.createdAt = dayjs().toString();
    this.updatedAt = dayjs().toString();
  }

  @BeforeUpdate()
  update() {
    this.updatedAt = dayjs().toString();
  }
}
