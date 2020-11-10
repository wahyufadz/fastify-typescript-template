import dayjs from 'dayjs';
import { AfterLoad, BeforeInsert, Column, Entity } from "typeorm";
import { BasicEntity } from '../basic';

@Entity()
export class User extends BasicEntity {

  @Column()
  firstName: string = '';

  @Column()
  lastName: string = '';

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @AfterLoad()
  load() {
    this.updatedAt = dayjs(this.updatedAt).format()
    this.createdAt = dayjs(this.createdAt).format()
  }

  @BeforeInsert()
  insert() {
    this.isActive = true;
  }

}
