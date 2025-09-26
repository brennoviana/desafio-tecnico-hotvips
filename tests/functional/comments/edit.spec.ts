import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import CommentsController from '#controllers/comments_controller'
import app from '@adonisjs/core/services/app'
import { CommentInterface } from '#interfaces/comment_interface'

test.group('Comments edit', () => {
  test('should update comment with valid data', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async updateComment(): Promise<CommentInterface> {
        return {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Comentário atualizado',
          status: 'approved',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: null,
        }
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
        text: 'Comentário atualizado',
        status: 'approved',
      }

      const response = await client.put('/comments/1').json(commentData)

      response.assertStatus(200)
      response.assertBodyContains({
        commentId: 1,
        postId: 1,
        authorId: 1,
        text: 'Comentário atualizado',
        status: 'approved',
        deleted: false,
      })

      assert.exists(response.body().updatedAt)
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return error when comment update fails', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async updateComment(): Promise<CommentInterface> {
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
        text: 'Comentário atualizado',
        status: 'approved',
      }

      const response = await client.put('/comments/1').json(commentData)

      response.assertStatus(404)
      response.assertBodyContains({
        error: 'Failed to update comment',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return validation error when required fields are missing', async ({ client }) => {
    class FakeCommentService extends CommentService {
      async updateComment(): Promise<CommentInterface> {
        return {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Comentário atualizado',
          status: 'approved',
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: null,
        }
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
        // Missing required fields: text
      }

      const response = await client.put('/comments/1').json(commentData)

      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            field: 'text',
            message: 'The text field must be defined',
            rule: 'required',
          },
        ],
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })
})
