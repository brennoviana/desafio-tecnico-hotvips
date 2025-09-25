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
  deleteComment(id: number): Promise<boolean>
  getCommentsByPostId(postId: number): Promise<CommentInterface[]>
  getCommentsByAuthorId(authorId: number): Promise<CommentInterface[]>
  getCommentsByStatus(status: string): Promise<CommentInterface[]>
  getCommentsByDate(date: Date): Promise<CommentInterface[]>
  getPendingCommentsByPostId(postId: number): Promise<CommentInterface[]>
}
