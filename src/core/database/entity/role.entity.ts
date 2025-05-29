import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("role")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  role_id!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  role_name!: string;

  @OneToMany(() => User, (user) => user.role, { cascade: true })
  user!: User[];
}
