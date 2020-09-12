import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 255)
      table.string('email', 255)
      table.string('phone', 13)
      table.string('responsible', 13)

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
