import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./base.entity";
import { Movie } from "./movie.entity";
import { Theater } from "./theater.entity";
import { Screen } from "./screen.entity";

@Entity("show")
export class Show extends Base {
  @PrimaryGeneratedColumn("uuid")
  show_id!: string;

  @Column({ type: "date" })
  show_date!: string; // e.g., '2025-05-25'

  @Column({ type: "time" })
  start_time!: string; // e.g., '14:30:00' (2:30 PM)

  @Column({ type: "time" })
  end_time!: string; // e.g., '17:00:00' (5:00 PM)

  @ManyToOne(() => Movie, (movie) => movie.movie_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "movie", referencedColumnName: "movie_id" })
  movie!: Movie;

  @ManyToOne(() => Theater, (theater) => theater.theater_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "theater", referencedColumnName: "theater_id" })
  theater!: Theater;

  @ManyToOne(() => Screen, (screen) => screen.screen_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "screen", referencedColumnName: "screen_id" })
  screen!: Screen;
}
