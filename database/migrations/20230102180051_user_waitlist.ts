import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users_waitlist", function (table) {
    table.bigIncrements("id")
    table.string("email", 255).unique().notNullable()
    table.bigInteger("createdAt")
    table.bigInteger("updatedAt")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users_waitlist")
}
