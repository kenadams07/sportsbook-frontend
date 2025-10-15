import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToUsers1760584500000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add updatedAt column to users table with default value
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop updatedAt column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}