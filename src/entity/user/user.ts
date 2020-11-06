import { Column, Entity } from "typeorm";
import { BasicEntity } from '../basic';

@Entity()
export class User extends BasicEntity {

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // ? username / email
  @Column()
  identity: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

}
