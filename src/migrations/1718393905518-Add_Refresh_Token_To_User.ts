import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUser1718393905518 implements MigrationInterface {
  name = 'AddRefreshTokenToUser1718393905518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_token" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
  }
}
