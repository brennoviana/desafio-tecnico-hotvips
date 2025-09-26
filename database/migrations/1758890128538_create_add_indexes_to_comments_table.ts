import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index('postId', 'idx_comments_post_id')

      table.index('authorId', 'idx_comments_author_id')

      table.index('status', 'idx_comments_status')

      table.index('parentId', 'idx_comments_parent_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('idx_comments_post_id')
      table.dropIndex('idx_comments_author_id')
      table.dropIndex('idx_comments_status')
      table.dropIndex('idx_comments_parent_id')
    })
  }
}