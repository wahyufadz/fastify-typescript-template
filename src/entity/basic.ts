import dayjs from 'dayjs';
import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";

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
