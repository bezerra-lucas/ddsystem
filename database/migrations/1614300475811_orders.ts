import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('type', 1)

      table.dateTime('date_time')

      table.string('content')

      table.integer('service_id')
        .references('id')
        .inTable('services')

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
