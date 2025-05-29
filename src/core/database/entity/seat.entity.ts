import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./base.entity";
import { Screen } from "./screen.entity";

@Entity("seat")
export class Seat extends Base {
  @PrimaryGeneratedColumn("uuid")
  seat_id: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  seat_type!: string;

  @Column({ type: "boolean", default: false })
  is_locked!: boolean;

  @ManyToOne(() => Screen, (screen) => screen.screen_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "screen", referencedColumnName: "screen_id" })
  screen!: Screen;
}
