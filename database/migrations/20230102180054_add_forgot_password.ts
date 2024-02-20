import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function (table) {
      table.string("resetPasswordToken", 64)
      table.bigInteger('resetPasswordExpiresAt')
      table.integer('forgotPasswordAttempts').defaultTo(0)
      table.bigInteger('restrictForgotPasswordUntil')
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', function(table) {
      table.dropColumn('resetPasswordToken')
      table.dropColumn('resetPasswordExpiresAt')
      table.dropColumn('forgotPasswordAttempts')
      table.dropColumn('restrictForgotPasswordUntil')
    })
}