import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: Number

  @column()
  public dateTime: String

  @column()
  public content: string

  @column()
  public service_id: Number

  @column()
  public client_id: Number

  @column()
  public user_id: Number

  @column()
  public budget_id: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
