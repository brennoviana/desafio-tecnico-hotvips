import { test } from '@japa/runner'
import { CommentService } from '#services/comment_service'
import CommentsController from '#controllers/comments_controller'
import app from '@adonisjs/core/services/app'
import { CommentInterface } from '#interfaces/comment_interface'

test.group('Comments editApproval', () => {
  test('should update comment approval status', async ({ client, assert }) => {
    class FakeCommentService extends CommentService {
      async updateComment(): Promise<CommentInterface> {
        return {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Comentário aprovado',
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
      const approvalData = {
        status: 'approved',
      }

      const response = await client.patch('/comments/1/approval').json(approvalData)

      response.assertStatus(200)
      response.assertBodyContains({
        commentId: 1,
        postId: 1,
        authorId: 1,
        text: 'Comentário aprovado',
        status: 'approved',
        deleted: false,
      })

      assert.exists(response.body().updatedAt)
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return error when comment approval update fails', async ({ client, assert }) => {
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
      const approvalData = {
        status: 'approved',
      }

      const response = await client.patch('/comments/1/approval').json(approvalData)

      response.assertStatus(404)
      response.assertBodyContains({
        error: 'Failed to update comment approval',
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })

  test('should return validation error when status is invalid', async ({ client }) => {
    class FakeCommentService extends CommentService {
      async updateComment(): Promise<CommentInterface> {
        return {
          commentId: 1,
          postId: 1,
          authorId: 1,
          text: 'Comentário aprovado',
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
      const approvalData = {
        status: 'invalid_status',
      }

      const response = await client.patch('/comments/1/approval').json(approvalData)

      response.assertStatus(422)
      response.assertBodyContains({
        errors: [
          {
            field: 'status',
            message: 'The selected status is invalid',
            rule: 'in',
          },
        ],
      })
    } finally {
      app.container.restore(CommentsController)
    }
  })
})
