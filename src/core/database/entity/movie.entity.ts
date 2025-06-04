import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "./show.entity";

@Entity("movie")
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  movie_id!: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  movie_name!: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  movie_description!: string;

  @Column({ type: "date" })
  release_date!: string; // e.g., '2025-05-25'

  @OneToMany(() => Show, (show) => show.movie, { cascade: true })
  show!: Show[];
}
