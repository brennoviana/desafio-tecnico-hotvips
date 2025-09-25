import { Logger } from '@adonisjs/core/logger'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { CommentRepository } from '../repositories/comment_repository.js'
import { CommentService } from '../services/comment_service.js'
import CommentsController from '../controllers/comments_controller.js'

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "ctx" object
 * - And bind "Logger" class to the "ctx.logger" object
 */
export default class ContainerBindingsMiddleware {
  handle(ctx: HttpContext, next: NextFn) {
    ctx.containerResolver.bindValue(HttpContext, ctx)
    ctx.containerResolver.bindValue(Logger, ctx.logger)

    const commentRepository = new CommentRepository()
    const commentService = new CommentService(commentRepository)

    ctx.containerResolver.bindValue(CommentRepository, commentRepository)
    ctx.containerResolver.bindValue(CommentService, commentService)
    ctx.containerResolver.bindValue(CommentsController, new CommentsController(commentService))

    return next()
  }
}
