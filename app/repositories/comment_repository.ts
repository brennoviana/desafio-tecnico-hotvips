import Comment from '#models/comment'
import type { CommentInterface, CommentRepositoryInterface } from '#interfaces/comment_interface'

export class CommentRepository implements CommentRepositoryInterface {
  

  async createComment(commentData: Partial<CommentInterface>): Promise<CommentInterface> {
    const { createdAt, updatedAt, ...data } = commentData
    const comment = await Comment.create(data)
    return this.mapModelToInterface(comment)
  }

  async getCommentById(id: number): Promise<CommentInterface | null> {
    const comment = await Comment.query().where('commentId', id).where('deleted', false).first()
    return comment ? this.mapModelToInterface(comment) : null
  }

  async updateComment(
    id: number,
    commentData: Partial<CommentInterface>
  ): Promise<CommentInterface | null> {
    const comment = await Comment.query().where('commentId', id).where('deleted', false).first()
    if (!comment) {
      return null
    }

    Object.assign(comment, commentData)
    await comment.save()
    return this.mapModelToInterface(comment)
  }

  async softDelete(id: number): Promise<boolean> {
    const comment = await Comment.query().where('commentId', id).where('deleted', false).first()
    if (!comment) {
      return false
    }

    comment.deleted = true
    await comment.save()
    return true
  }

  async getCommentsByPostId(postId: number): Promise<CommentInterface[]> {
    const comments = await Comment.query()
      .where('postId', postId)
      .where('deleted', false)
      .where('status', 'approved')

    return comments.map((comment) => this.mapModelToInterface(comment))
  }

  async getPendingCommentsByPostId(postId: number): Promise<CommentInterface[]> {
    const comments = await Comment.query()
      .where('postId', postId)
      .where('deleted', false)
      .where('status', 'pending')

    return comments.map((comment) => this.mapModelToInterface(comment))
  }

  private mapModelToInterface(comment: Comment): CommentInterface {
    return {
      commentId: comment.$primaryKeyValue as number,
      postId: comment.postId,
      authorId: comment.authorId,
      text: comment.text,
      status: comment.status,
      parentId: comment.parentId,
      deleted: comment.deleted,
      createdAt: comment.createdAt.toJSDate(),
      updatedAt: comment.updatedAt.toJSDate(),
    }
  }
}
