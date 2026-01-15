import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentIdToUsers1760284500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add parentId column to users table
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "parentId" uuid`);

    // Create foreign key constraint for self-referencing relationship
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_parentId" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_parentId"`,
    );

    // Drop parentId column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "parentId"`);
  }
}
