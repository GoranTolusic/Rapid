import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.bigIncrements("id")
    table.string("name", 255)
    table.string("surname", 255)
    table.string("username", 255)
    table.string("email", 255).unique().notNullable()
    table.string("password", 255).notNullable()
    table.boolean("active").defaultTo("active").index()
    table.enum("globalState", ["default"]).defaultTo("default")
    table.string("verifyToken", 255)
    table.boolean("verified").defaultTo(false).index()
    table.text("refreshToken")
    table.string("phone", 30)
    table.integer("loginAttempts").defaultTo(0)
    table.bigInteger("restrictLoginUntil")
    table.string("uid", 255).unique().notNullable()
    table.bigInteger("createdAt")
    table.bigInteger("updatedAt")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}
