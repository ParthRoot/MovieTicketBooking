import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseSetup1748497251349 implements MigrationInterface {
  name = "BaseSetup1748497251349";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie" ("movie_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "movie_name" character varying(300), "movie_description" character varying(1000), "release_date" date NOT NULL, CONSTRAINT "PK_f38244c6e76d8e50e1a590f6744" PRIMARY KEY ("movie_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "show" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "show_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "show_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "movie" uuid, "theater" uuid, "screen" uuid, CONSTRAINT "PK_b51ebf3cab66ee6ce925af09bdf" PRIMARY KEY ("show_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "seat" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "seat_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seat_type" character varying(300), "is_locked" boolean NOT NULL DEFAULT false, "screen" uuid, CONSTRAINT "PK_4f04b249b06dec90b7bf370f706" PRIMARY KEY ("seat_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "screen" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "screen_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "screen_name" character varying(300), "silver_seats_count" numeric NOT NULL DEFAULT '0', "gold_seats_count" numeric NOT NULL DEFAULT '0', "platinum_seats_count" numeric NOT NULL DEFAULT '0', "theater" uuid, CONSTRAINT "PK_141994f114fc6231747dc780c8b" PRIMARY KEY ("screen_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "theater" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "theater_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "theater_name" character varying(300), "state" character varying(300), "city" character varying(300), "address" character varying(300), CONSTRAINT "PK_f141fdfcaeb58170b31b34aeed8" PRIMARY KEY ("theater_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("role_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" character varying(300), CONSTRAINT "PK_df46160e6aa79943b83c81e496e" PRIMARY KEY ("role_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(300), "last_name" character varying(300), "email" character varying(300), "salt" character varying(300) NOT NULL, "password_hash" character varying(300) NOT NULL, "phone" character varying(100), "avatar" character varying, "role" uuid, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "booking_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_type" character varying(300), "is_payment" boolean NOT NULL DEFAULT false, "seat" uuid, "show" uuid, "user" uuid, CONSTRAINT "PK_9ecc24640e39cd493c318a117f1" PRIMARY KEY ("booking_id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "show" ADD CONSTRAINT "FK_c33f8db375c1a77a832768379f6" FOREIGN KEY ("movie") REFERENCES "movie"("movie_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "show" ADD CONSTRAINT "FK_3c8764b861f29b4332d98250d5c" FOREIGN KEY ("theater") REFERENCES "theater"("theater_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "show" ADD CONSTRAINT "FK_76459807f671b005563f554b7af" FOREIGN KEY ("screen") REFERENCES "screen"("screen_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "seat" ADD CONSTRAINT "FK_d0895a910f8600b4a5123a5f5f4" FOREIGN KEY ("screen") REFERENCES "screen"("screen_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "screen" ADD CONSTRAINT "FK_d9f28c3b6bb38f091d9a234fb87" FOREIGN KEY ("theater") REFERENCES "theater"("theater_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_6620cd026ee2b231beac7cfe578" FOREIGN KEY ("role") REFERENCES "role"("role_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_3ef7eec15f340b37e9d51570ee7" FOREIGN KEY ("seat") REFERENCES "seat"("seat_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_5aad8a78658818838f7197fb998" FOREIGN KEY ("show") REFERENCES "show"("show_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_b3a629fbe6abb102b2f1a3d86fb" FOREIGN KEY ("user") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_b3a629fbe6abb102b2f1a3d86fb"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_5aad8a78658818838f7197fb998"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_3ef7eec15f340b37e9d51570ee7"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_6620cd026ee2b231beac7cfe578"`
    );
    await queryRunner.query(
      `ALTER TABLE "screen" DROP CONSTRAINT "FK_d9f28c3b6bb38f091d9a234fb87"`
    );
    await queryRunner.query(
      `ALTER TABLE "seat" DROP CONSTRAINT "FK_d0895a910f8600b4a5123a5f5f4"`
    );
    await queryRunner.query(
      `ALTER TABLE "show" DROP CONSTRAINT "FK_76459807f671b005563f554b7af"`
    );
    await queryRunner.query(
      `ALTER TABLE "show" DROP CONSTRAINT "FK_3c8764b861f29b4332d98250d5c"`
    );
    await queryRunner.query(
      `ALTER TABLE "show" DROP CONSTRAINT "FK_c33f8db375c1a77a832768379f6"`
    );
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "theater"`);
    await queryRunner.query(`DROP TABLE "screen"`);
    await queryRunner.query(`DROP TABLE "seat"`);
    await queryRunner.query(`DROP TABLE "show"`);
    await queryRunner.query(`DROP TABLE "movie"`);
  }
}
