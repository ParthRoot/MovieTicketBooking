import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveAndIsVerifiedInUser1748689531429
  implements MigrationInterface
{
  name = "AddIsActiveAndIsVerifiedInUser1748689531429";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "reset_password_expires_at" TIMESTAMP WITH TIME ZONE`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_active" boolean NOT NULL DEFAULT true`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_verified" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "reset_password_token" text`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_5b494fc54a2e3d122f17b393598" UNIQUE ("reset_password_token")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_5b494fc54a2e3d122f17b393598"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "reset_password_token"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_active"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "reset_password_expires_at"`
    );
  }
}
