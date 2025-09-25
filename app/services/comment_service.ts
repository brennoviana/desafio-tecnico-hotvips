import type { CommentInterface, CommentRepositoryInterface } from '#interfaces/comment_interface'

export class CommentService {
  constructor(private commentRepository: CommentRepositoryInterface) {}

  async createComment(commentData: Partial<CommentInterface>): Promise<CommentInterface> {
    return await this.commentRepository.createComment(commentData)
  }

  async getCommentById(id: number): Promise<CommentInterface | null> {
    return await this.commentRepository.getCommentById(id)
  }

  async getParentCommentById(id: number): Promise<CommentInterface | null> {
    const parentComment = await this.commentRepository.getCommentById(id)
    if (!parentComment) {
      throw new Error('Parent comment not found')
    }

    return parentComment
  }

  async updateComment(
    id: number,
    commentData: Partial<CommentInterface>
  ): Promise<CommentInterface> {
    const existingComment = await this.commentRepository.getCommentById(id)
    if (!existingComment) {
      throw new Error('Comment not found')
    }

    const updatedComment = await this.commentRepository.updateComment(id, commentData)
    if (!updatedComment) {
      throw new Error('Failed to update comment')
    }

    return updatedComment
  }

  async deleteComment(id: number): Promise<void> {
    const existingComment = await this.commentRepository.getCommentById(id)
    if (!existingComment) {
      throw new Error('Comment not found')
    }

    const deleted = await this.commentRepository.deleteComment(id)
    if (!deleted) {
      throw new Error('Failed to delete comment')
    }
  }

  async getCommentsByPostId(postId: number): Promise<CommentInterface[]> {
    return await this.commentRepository.getCommentsByPostId(postId)
  }

  async getPendingCommentsByPostId(postId: number): Promise<CommentInterface[]> {
    return await this.commentRepository.getPendingCommentsByPostId(postId)
  }

  async getCommentsByAuthorId(authorId: number): Promise<CommentInterface[]> {
    return await this.commentRepository.getCommentsByAuthorId(authorId)
  }

  async getCommentsByStatus(status: string): Promise<CommentInterface[]> {
    return await this.commentRepository.getCommentsByStatus(status)
  }

  async getCommentsByDate(date: Date): Promise<CommentInterface[]> {
    return await this.commentRepository.getCommentsByDate(date)
  }
}
