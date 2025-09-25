import router from '@adonisjs/core/services/router'
const CommentsController = () => import('#controllers/comments_controller')

router
  .group(() => {
    router.post('/posts/:postId/comments', [CommentsController, 'store'])
    router.get('/posts/:postId/comments', [CommentsController, 'index'])
    router.get('/posts/:postId/comments/pending', [CommentsController, 'pending'])

    router.put('/comments/:commentId', [CommentsController, 'edit'])
    router.patch('/comments/:commentId/approval', [CommentsController, 'editApproval'])
    router.delete('/comments/:commentId', [CommentsController, 'destroy'])
  })
  .prefix('/api/v1')

router.get('/health', ({ response }) => {
  return response.ok({ status: 'ok' })
})
