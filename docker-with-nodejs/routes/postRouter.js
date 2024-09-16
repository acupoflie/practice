const router = require('express').Router()
const postController = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')

router.route('/')
    .get(protect, postController.getAllPosts)
    .post(protect, postController.createPost)

router.route('/:id')
    .get(protect, postController.getPost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost)

module.exports=router;