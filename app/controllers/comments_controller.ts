import type { HttpContext } from '@adonisjs/core/http'
import type { CommentService } from '../services/comment_service.js'
import {
  createCommentValidator,
  editCommentValidator,
  editApprovalValidator,
  postIdValidator,
  commentIdValidator,
} from '#validators/comment'

export default class CommentsController {
  constructor(private commentService: CommentService) {}

  async store({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(createCommentValidator)

    try {
      const comment = await this.commentService.createComment({ postId, ...payload })

      return response.json(comment)
    } catch (error) {
      return response.status(400).json({ error: 'Failed to create comment'})
    }
  }

  async edit({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(editCommentValidator)

    try {
      const updatedComment = await this.commentService.updateComment(commentId, {
        text: payload.text,
      })
      return response.json(updatedComment)
    } catch (error) {
      return response.status(404).json({ error: 'Failed to update comment'})
    }
  }

  async editApproval({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(editApprovalValidator)

    try {
      const updatedComment = await this.commentService.updateComment(commentId, {
        status: payload.status,
      })
      return response.json(updatedComment)
    } catch (error) {
      return response.status(404).json({ error: 'Failed to update comment approval'})
    }
  }

  async destroy({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })

    try {
      await this.commentService.deleteComment(commentId)
      return response.json({ message: 'Comment deleted' })
    } catch (error) {
      return response.status(404).json({ error: 'Failed to delete comment'})
    }
  }

  async index({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })

    try {
      const comments = await this.commentService.getCommentsByPostId(postId)

      return response.json(comments)
    } catch (error) {
      return response.status(400).json({ error: 'Failed to get comments'})
    }
  }

  async pending({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })

    try {
      const comments = await this.commentService.getPendingCommentsByPostId(postId)

      return response.json(comments)
    } catch (error) {
      return response.status(400).json({ error: 'Failed to get pending comments'})
    }
  }
}
