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
    const now = dayjs().format();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  update() {
    const now = dayjs().format();
    this.updatedAt = now;
  }
}
