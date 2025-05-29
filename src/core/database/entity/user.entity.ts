import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./base.entity";
import { Role } from "./role.entity";

@Entity("user")
export class User extends Base {
  @PrimaryGeneratedColumn("uuid")
  user_id!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  first_name!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  last_name!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  email!: string;

  @Column({ type: "varchar", length: 300 })
  salt!: string;

  @Column({ type: "varchar", length: 300 })
  password_hash!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  phone!: string;

  @Column({ type: "varchar", nullable: true, default: null })
  avatar!: string;

  @ManyToOne(() => Role, (role) => role.role_id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "role", referencedColumnName: "role_id" })
  role!: Role;
}
