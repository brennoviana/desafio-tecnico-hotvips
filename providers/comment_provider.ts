import type { ApplicationService } from '@adonisjs/core/types'
import { CommentRepository } from '../app/repositories/comment_repository.js'
import { CommentService } from '../app/services/comment_service.js'
import CommentsController from '../app/controllers/comments_controller.js'

export default class CommentProvider {
  constructor(protected app: ApplicationService) {}
  register() {
    this.app.container.singleton(CommentRepository, () => new CommentRepository())

    this.app.container.singleton(CommentService, async (resolver) => {
      const commentRepository = await resolver.make(CommentRepository)
      return new CommentService(commentRepository)
    })

    this.app.container.singleton(CommentsController, async (resolver) => {
      const commentService = await resolver.make(CommentService)
      return new CommentsController(commentService)
    })
  }
}
