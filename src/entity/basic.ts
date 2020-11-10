import dayjs from 'dayjs';
import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";
export abstract class BasicEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'null',
    nullable: true,
  })
  updatedAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'null',
    nullable: true,
  })
  createdAt: string;

  @BeforeInsert()
  basicInsert() {
    const now = dayjs().toISOString()
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  basicUpdate() {
    this.updatedAt = dayjs().toISOString()
  }
}
