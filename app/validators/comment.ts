import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    authorId: vine.number().positive(),
    text: vine.string().trim().minLength(1).maxLength(1024),
    status: vine.string().in(['pending', 'approved', 'rejected']).optional(),
    parentId: vine.number().positive().optional(),
  })
)

export const getCommentsValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
  })
)

export const editCommentValidator = vine.compile(
  vine.object({
    text: vine.string().trim().minLength(1).maxLength(1024),
  })
)

export const editApprovalValidator = vine.compile(
  vine.object({
    status: vine.string().in(['pending', 'approved', 'rejected']),
  })
)

export const postIdValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
  })
)

export const commentIdValidator = vine.compile(
  vine.object({
    commentId: vine.number().positive(),
  })
)
