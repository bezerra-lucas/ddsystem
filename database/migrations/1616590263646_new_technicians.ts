import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Technicians extends BaseSchema {
  protected tableName = 'technicians'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.string('phone')
      table.string('color')
      table.string('email')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
