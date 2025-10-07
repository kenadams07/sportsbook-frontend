import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyIdToUsers1759758154691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "currency_id" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_9b53d0bfa309b8b2c1389d0a1f" ON "users" ("currency_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9b53d0bfa309b8b2c1389d0a1f" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9b53d0bfa309b8b2c1389d0a1f"`);
        await queryRunner.query(`DROP INDEX "IDX_9b53d0bfa309b8b2c1389d0a1f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currency_id"`);
    }

}