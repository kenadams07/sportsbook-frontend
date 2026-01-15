import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsersTableRemoveFields1767092835441
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the columns that need to be removed
    await queryRunner.dropColumn('users', 'zipcode');
    await queryRunner.dropColumn('users', 'address');
    await queryRunner.dropColumn('users', 'gender');
    await queryRunner.dropColumn('users', 'middlename');
    await queryRunner.dropColumn('users', 'occupation');
    await queryRunner.dropColumn('users', 'salaryLevel');
    await queryRunner.dropColumn('users', 'surname');
    await queryRunner.dropColumn('users', 'city');
    await queryRunner.dropColumn('users', 'county');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the columns in reverse order for rollback
    await queryRunner.query(
      `ALTER TABLE "users" ADD "county" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "surname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "salaryLevel" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "occupation" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "middlename" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "gender" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "zipcode" character varying`,
    );
  }
}
