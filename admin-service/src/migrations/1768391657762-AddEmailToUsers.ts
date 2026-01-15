import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUsers1768391657762 implements MigrationInterface {
    name = 'AddEmailToUsers1768391657762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add email column as nullable first
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN IF NOT EXISTS "email" character varying
        `);

        // Update any existing records with a default email if needed
        // For existing records, you might want to assign a placeholder email
        // Or ensure all existing records have unique emails before adding the unique constraint
        
        // Add unique constraint to email column
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD CONSTRAINT "UQ_e1287c080cccb3de4a51d2f1a2d" UNIQUE ("email")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP CONSTRAINT "UQ_e1287c080cccb3de4a51d2f1a2d"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "email"
        `);
    }
}