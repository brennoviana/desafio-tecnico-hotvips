import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import app from '@adonisjs/core/services/app'
import { CommentInterface } from '#interfaces/comment_interface'

test.group('Comments create', () => {
  test('should create a comment with valid data', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async createComment(): Promise<CommentInterface> {
        return {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Este é um comentário de teste',
          status: 'pending',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: null,
        }
      }
    }

    app.container.swap(CommentService, () => {
      return new FakeCommentService({} as any)
    })

    try {
      const commentData = {
        authorId: 1,
        text: 'Este é um comentário de teste',
        status: 'pending',
      }

      const response = await client.post('/posts/1/comments').json(commentData)

      response.assertStatus(200)
      response.assertBodyContains({
        postId: 1,
        authorId: 1,
        text: 'Este é um comentário de teste',
        status: 'pending',
        deleted: false,
      })

      assert.exists(response.body().commentId)
      assert.exists(response.body().createdAt)
      assert.exists(response.body().updatedAt)
    } finally {
      app.container.restore(CommentService)
    }
  })
})
