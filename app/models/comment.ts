import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'

export default class Comment extends BaseModel {
  @column({ isPrimary: true, columnName: 'commentId' })
  declare commentId: number

  @column({ columnName: 'postId' })
  declare postId: number

  @column({ columnName: 'authorId' })
  declare authorId: number

  @column()
  declare text: string

  @column({ columnName: 'parentId' })
  declare parentId: number | null

  @column()
  declare status: string

  @column()
  declare deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Comment, {
    foreignKey: 'parentId',
    localKey: 'commentId',
  })
  declare parent: any

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
    localKey: 'commentId',
  })
  declare children: any
}
