import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function (table) {
      table.string("username", 255).unique().alter()
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function(table) {
      table.string("username", 255)
    })
}