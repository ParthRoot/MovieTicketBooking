import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1746843456923 implements MigrationInterface {
    name = 'CreateUserTable1746843456923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "auth_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(300), "password_hash" character varying(300) NOT NULL, "salt" character varying(300) NOT NULL, "user_id" uuid, CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"), CONSTRAINT "PK_af0cc717858a61134001998704f" PRIMARY KEY ("auth_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(300), "last_name" character varying(300), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
