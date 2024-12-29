const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken.js')

const { uploadPost, getPosts, getProfilePosts, getPost, deletePost, repost, unrepost} = require('../controller/postController.js')

router.get('/', getPosts)

router.get('/:id', getPost)

router.post('/upload', authmeToken, uploadPost)

router.post('/:id/delete', authmeToken, deletePost)

router.get('/:id/repost', authmeToken, repost)

router.get('/:id/unrepost', authmeToken, unrepost)

router.post('/', getProfilePosts)


module.exports = router;