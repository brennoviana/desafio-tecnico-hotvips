import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('commentId').primary()
      table.integer('postId').notNullable()
      table.integer('authorId').notNullable()
      table.string('text', 1024).notNullable()
      table.integer('parentId').nullable().references('commentId').inTable('comments')
      table.string('status', 20).defaultTo('pending')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
      table.boolean('deleted').defaultTo(false)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
