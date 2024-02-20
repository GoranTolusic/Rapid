import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function (table) {
        table.bigInteger('deletedAt').nullable()
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function(table) {
        table.dropColumn('deletedAt')
    })
}