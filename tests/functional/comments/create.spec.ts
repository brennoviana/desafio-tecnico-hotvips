import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import CommentsController from '#controllers/comments_controller'
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

  test('should return error when comment creation fails', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async createComment(): Promise<CommentInterface> {
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
      const commentData = {
        authorId: 1,
        text: 'Este é um comentário de teste',
        status: 'pending',
      }

      const response = await client.post('/posts/1/comments').json(commentData)

      response.assertStatus(400)
      response.assertBodyContains({
        error: 'Failed to create comment',
      })
    } finally {
      app.container.restore(CommentsController)
      app.container.restore(CommentService)
    }
  })

  test('should return validation error when required fields are missing', async ({ client }) => {
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
        // Missing required fields: authorId, text
      }

      const response = await client.post('/posts/1/comments').json(commentData)

      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            field: 'authorId',
            message: 'The authorId field must be defined',
            rule: 'required',
          },
          {
            field: 'text',
            message: 'The text field must be defined',
            rule: 'required',
          },
        ],
      })
    } finally {
      app.container.restore(CommentService)
    }
  })
})
