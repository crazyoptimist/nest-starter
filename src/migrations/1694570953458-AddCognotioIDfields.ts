import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCognotioIDfields1694570953458 implements MigrationInterface {
    name = 'AddCognotioIDfields1694570953458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(16) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`external_identity_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`external_identity_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    }

}
