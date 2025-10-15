const { MigrationInterface, QueryRunner, TableColumn } = require("typeorm");

module.exports = class AddTimestampsToUsers1735747200000 {
    name = 'AddTimestampsToUsers1735747200000'

    async up(queryRunner) {
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'now()',
                isNullable: false
            }),
            new TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'now()',
                isNullable: false
            })
        ]);
    }

    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'createdAt');
        await queryRunner.dropColumn('users', 'updatedAt');
    }
}