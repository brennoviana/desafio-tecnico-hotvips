import type { HttpContext } from '@adonisjs/core/http'
import  { type CommentService, CommentServiceError } from '../services/comment_service.js'
import {
  createCommentValidator,
  editCommentValidator,
  editApprovalValidator,
  postIdValidator,
  commentIdValidator,
} from '#validators/comment'

export default class CommentsController {
  constructor(private commentService: CommentService) {}

  async store({ request, response, logger }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(createCommentValidator)

    try {
      const comment = await this.commentService.createComment({ postId, ...payload })
      logger.info({ postId, payload }, 'Comment created')

      return response.json(comment)
    } catch (error) {
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      logger.error(error)
      return response.status(400).json({ error: 'Failed to create comment'})
    }
  }

  async edit({ request, response, logger }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(editCommentValidator)

    try {
      const updatedComment = await this.commentService.updateComment(commentId, {
        text: payload.text,
      })
      logger.info({ commentId, payload }, 'Comment updated')
      return response.json(updatedComment)
    } catch (error) {
      logger.error(error)
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      return response.status(404).json({ error: 'Failed to update comment' })
    }
  }

  async editApproval({ request, response, logger }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(editApprovalValidator)

    try {
      const updatedComment = await this.commentService.updateComment(commentId, {
        status: payload.status,
      })
      logger.info({ commentId, payload }, 'Comment approval updated')
      return response.json(updatedComment)
    } catch (error) {
      logger.error(error)
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      return response.status(404).json({ error: 'Failed to update comment approval'})
    }
  }

  async destroy({ request, response, logger }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })

    try {
      await this.commentService.deleteComment(commentId)
      logger.info({ commentId }, 'Deleting comment')
      return response.json({ message: 'Comment deleted' })
    } catch (error) {
      logger.error(error)
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      return response.status(404).json({ error: 'Failed to delete comment'})
    }
  }

  async index({ request, response, logger }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })

    try {
      const comments = await this.commentService.getCommentsByPostId(postId)
      logger.info({ postId }, 'Getting comments')
      return response.json(comments)
    } catch (error) {
      logger.error(error)
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      return response.status(400).json({ error: 'Failed to get comments'})
    }
  }

  async pending({ request, response, logger }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })

    try {
      const comments = await this.commentService.getPendingCommentsByPostId(postId)
      logger.info({ postId }, 'Getting pending comments')
      return response.json(comments)
    } catch (error) {
      logger.error(error)
      if (error instanceof CommentServiceError) {
        return response.status(400).json({ error: error.message })
      }
      return response.status(400).json({ error: 'Failed to get pending comments'})
    }
  }
}
