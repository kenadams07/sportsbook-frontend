import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCasinoFieldsToUsers1760484500000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add gap_casino_token column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "gap_casino_token" character varying`);
        
        // Add county column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "county" character varying`);
        
        // Add city column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop city column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
        
        // Drop county column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "county"`);
        
        // Drop gap_casino_token column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gap_casino_token"`);
    }

}