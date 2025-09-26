import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import CommentsController from '#controllers/comments_controller'
import app from '@adonisjs/core/services/app'

test.group('Comments destroy', () => {
  test('should delete comment successfully', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async deleteComment(): Promise<void> {
        // Simulate successful deletion
        return
      }
    }

    class FakeCommentsController extends CommentsController {
      constructor() {
        super(new FakeCommentService({} as any))
      }
    }

    app.container.swap(CommentsController, () => {
      return new FakeCommentsController()
    })

    try {
      const response = await client.delete('/comments/1')

      response.assertStatus(200)
      response.assertBodyContains({
        message: 'Comment deleted',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return error when comment deletion fails', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async deleteComment(): Promise<void> {
        throw new Error('Database connection failed')
      }
    }

    class FakeCommentsController extends CommentsController {
      constructor() {
        super(new FakeCommentService({} as any))
      }
    }

    app.container.swap(CommentsController, () => {
      return new FakeCommentsController()
    })

    try {
      const response = await client.delete('/comments/1')

      response.assertStatus(404)
      response.assertBodyContains({
        error: 'Failed to delete comment',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return error when comment not found', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async deleteComment(): Promise<void> {
        throw new Error('Comment not found')
      }
    }

    class FakeCommentsController extends CommentsController {
      constructor() {
        super(new FakeCommentService({} as any))
      }
    }

    app.container.swap(CommentsController, () => {
      return new FakeCommentsController()
    })

    try {
      const response = await client.delete('/comments/999')

      response.assertStatus(404)
      response.assertBodyContains({
        error: 'Failed to delete comment',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })
})
