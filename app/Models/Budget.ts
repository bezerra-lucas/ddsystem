import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Budget extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status: number

  @column()
  public content: String

  @column()
  public budget_layout_id: number

  @column()
  public user_id: number

  @column()
  public client_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
