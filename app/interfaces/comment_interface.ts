export interface CommentInterface {
  commentId: number
  postId: number
  authorId: number
  text: string
  status: string
  parentId: number | null
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CommentRepositoryInterface {
  createComment(comment: Partial<CommentInterface>): Promise<CommentInterface>
  getCommentById(id: number): Promise<CommentInterface | null>
  updateComment(id: number, comment: Partial<CommentInterface>): Promise<CommentInterface | null>
  softDelete(id: number): Promise<boolean>
  getCommentsByPostId(postId: number): Promise<CommentInterface[]>
  getPendingCommentsByPostId(postId: number): Promise<CommentInterface[]>
}
