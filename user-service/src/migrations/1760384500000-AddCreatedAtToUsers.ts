import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToUsers1760384500000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add createdAt column to users table with default value
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop createdAt column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    }

}