import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 70)
      table.string('cep', 8)
      table.string('street', 255)
      table.string('number', 20)

      table.integer('client_id')
        .notNullable()
        .references('id')
        .inTable('clients')

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
