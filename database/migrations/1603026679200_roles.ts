import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')

      table.boolean('has_permission_to_create_clients')
      table.boolean('has_permission_to_see_client_panel')
      table.boolean('has_permission_to_manage_budgets')
      table.boolean('has_permission_to_manage_budget_layouts')
      table.boolean('has_permission_to_manage_orders')
      table.boolean('has_permission_to_manage_historic')
      table.boolean('has_permission_to_access_gps_tracker')
      table.boolean('has_permission_to_manage_services')
      table.boolean('has_permission_to_manage_users')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
