import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";
import { Screen } from "./screen.entity";
import { Show } from "./show.entity";

@Entity("theater")
export class Theater extends Base {
  @PrimaryGeneratedColumn("uuid")
  theater_id!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  theater_name!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  state!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  city!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  address!: string;

  @OneToMany(() => Screen, (screen) => screen.theater, { cascade: true })
  screen!: Screen[];

  @OneToMany(() => Show, (show) => show.theater, { cascade: true })
  show!: Show[];
}
