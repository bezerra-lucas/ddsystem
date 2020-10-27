import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public has_permission_to_create_clients: boolean

  @column()
  public has_permission_to_see_client_panel: boolean

  @column()
  public has_permission_to_manage_budgets: boolean

  @column()
  public has_permission_to_manage_budget_layouts: boolean

  @column()
  public has_permission_to_manage_orders: boolean

  @column()
  public has_permission_to_manage_historic: boolean

  @column()
  public has_permission_to_access_gps_tracker: boolean

  @column()
  public has_permission_to_manage_services: boolean

  @column()
  public has_permission_to_manage_users: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
