import dayjs from 'dayjs';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class RevokeToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  token: string = '';

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  keepUntil: string;

  @BeforeInsert()
  insert() {
    this.keepUntil = dayjs().add(10, 'day').toISOString()
  }
}
