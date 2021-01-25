import { Column, Entity } from "typeorm";
import { BasicEntity } from "../basic";

@Entity()
export class User extends BasicEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: "" })
  firstName: string;

  @Column({ default: "" })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
