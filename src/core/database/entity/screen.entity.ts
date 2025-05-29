import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./base.entity";
import { Theater } from "./theater.entity";
import { Show } from "./show.entity";
import { Seat } from "./seat.entity";

@Entity("screen")
export class Screen extends Base {
  @PrimaryGeneratedColumn("uuid")
  screen_id: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  screen_name!: string;

  @Column({ type: "numeric", default: 0 })
  silver_seats_count!: number;

  @Column({ type: "numeric", default: 0 })
  gold_seats_count!: number;

  @Column({ type: "numeric", default: 0 })
  platinum_seats_count!: number;

  @ManyToOne(() => Theater, (theater) => theater.theater_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "theater", referencedColumnName: "theater_id" })
  theater!: Theater;

  @OneToMany(() => Show, (show) => show.screen, { cascade: true })
  show!: Show[];

  @OneToMany(() => Seat, (seat) => seat.screen, { cascade: true })
  seat!: Seat[];
}
