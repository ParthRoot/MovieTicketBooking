import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./base.entity";
import { Seat } from "./seat.entity";
import { Show } from "./show.entity";
import { User } from "./user.entity";

@Entity("booking")
export class Booking extends Base {
  @PrimaryGeneratedColumn("uuid")
  booking_id: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  payment_type!: string;

  @Column({ type: "boolean", default: false })
  is_payment!: boolean;

  @ManyToOne(() => Seat, (seat) => seat.seat_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "seat", referencedColumnName: "seat_id" })
  seat!: Seat;

  @ManyToOne(() => Show, (show) => show.show_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "show", referencedColumnName: "show_id" })
  show!: Show;

  @ManyToOne(() => User, (user) => user.user_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user", referencedColumnName: "user_id" })
  user!: User;
}
