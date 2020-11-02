import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Budgets extends BaseSchema {
  protected tableName = 'budgets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('status')

      table.text('content')

      table.integer('order_id')
        .references('id')
        .inTable('orders')
        .notNullable()

      table.integer('budget_layout_id')
        .references('id')
        .inTable('budget_layouts')

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
