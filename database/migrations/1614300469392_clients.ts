import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.boolean('is_pf').notNullable()
      table.string('name', 255).notNullable()
      table.string('cpf', 11)
      table.string('cnpj', 14)

      table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
