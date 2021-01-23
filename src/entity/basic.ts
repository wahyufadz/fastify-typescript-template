import dayjs from "dayjs";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from "typeorm";
export abstract class BasicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "timestamp",
    default: () => "null",
    nullable: true,
  })
  updatedAt: string;

  @Column({
    type: "timestamp",
    default: () => "null",
    nullable: true,
  })
  createdAt: string;

  @BeforeInsert()
  basicBeforeInsert() {
    const now = dayjs().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @AfterLoad()
  basicAfterLoad() {
    this.updatedAt = dayjs(this.updatedAt).format();
    this.createdAt = dayjs(this.createdAt).format();
  }

  @BeforeUpdate()
  basicBeforeUpdate() {
    this.updatedAt = dayjs().toISOString();
  }
}
