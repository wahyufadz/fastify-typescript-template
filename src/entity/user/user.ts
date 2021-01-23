import { BeforeInsert, Column, Entity } from "typeorm";
import { BasicEntity } from "../basic";

@Entity()
export class User extends BasicEntity {
  @Column()
  firstName: string = "";

  @Column()
  lastName: string = "";

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @BeforeInsert()
  insert() {
    this.isActive = true;
  }
}
