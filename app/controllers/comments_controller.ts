import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import {
  createCommentValidator,
  editCommentValidator,
  editApprovalValidator,
  postIdValidator,
  commentIdValidator,
} from '#validators/comment'

export default class CommentsController {
  async store({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })
    const payload = await request.validateUsing(createCommentValidator)
    const comment = await Comment.create({ postId, ...payload })

    return response.json(comment)
  }

  async edit({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const comment = await Comment.find(commentId)
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }
    const payload = await request.validateUsing(editCommentValidator)
    comment.text = payload.text
    await comment.save()

    return response.json(comment)
  }

  async editApproval({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const comment = await Comment.find(commentId)
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }
    const payload = await request.validateUsing(editApprovalValidator)
    comment.status = payload.status
    await comment.save()

    return response.json(comment)
  }

  async destroy({ request, response }: HttpContext) {
    const { commentId } = await request.validateUsing(commentIdValidator, {
      data: request.params(),
    })
    const comment = await Comment.find(commentId)
    if (!comment) {
      return response.status(404).json({ error: 'Comment not found' })
    }
    comment.deleted = true
    await comment.save()

    return response.json({ message: 'Comment deleted' })
  }

  async index({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })
    const comments = await Comment.query()
      .where('postId', postId)
      .where('deleted', false)
      .where('status', 'approved')

    return response.json(comments)
  }

  async pending({ request, response }: HttpContext) {
    const { postId } = await request.validateUsing(postIdValidator, {
      data: request.params(),
    })
    const comments = await Comment.query()
      .where('postId', postId)
      .where('deleted', false)
      .where('status', 'pending')

    return response.json(comments)
  }
}
