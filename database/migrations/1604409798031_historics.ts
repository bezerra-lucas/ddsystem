import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Historics extends BaseSchema {
  protected tableName = 'historics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('date')
      table.string('content')

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
