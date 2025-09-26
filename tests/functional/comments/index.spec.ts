import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import CommentsController from '#controllers/comments_controller'
import app from '@adonisjs/core/services/app'
import { CommentInterface } from '#interfaces/comment_interface'

test.group('Comments index', () => {
  test('should return list of comments for a post', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async getCommentsByPostId(): Promise<CommentInterface[]> {
        return [
          {
            commentId: 1,
            postId: 1,
            authorId: 1,
            text: 'Primeiro comentário',
            status: 'approved',
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: null,
          },
          {
            commentId: 2,
            postId: 1,
            authorId: 2,
            text: 'Segundo comentário',
            status: 'approved',
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: null,
          },
        ]
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
      const response = await client.get('/posts/1/comments')

      response.assertStatus(200)
      assert.isArray(response.body())
      assert.lengthOf(response.body(), 2)
      
      response.assertBodyContains([
        {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Primeiro comentário',
          status: 'approved',
          deleted: false,
        },
        {
          commentId: 2,
          postId: 1,
          authorId: 2,
          text: 'Segundo comentário',
          status: 'approved',
          deleted: false,
        },
      ])
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return empty array when no comments exist for post', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async getCommentsByPostId(): Promise<CommentInterface[]> {
        return []
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
      const response = await client.get('/posts/999/comments')

      response.assertStatus(200)
      assert.isArray(response.body())
      assert.lengthOf(response.body(), 0)
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return error when service fails', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async getCommentsByPostId(): Promise<CommentInterface[]> {
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
      const response = await client.get('/posts/1/comments')

      response.assertStatus(400)
      response.assertBodyContains({
        error: 'Failed to get comments',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })
})
