const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken')

const { likeComment , unlikeComment, addComment , deleteComment, loadComment, loadChildComment } = require('../controller/commentController')

router.get('/like/:id', authmeToken, likeComment)

router.get('/unlike/:id', authmeToken, unlikeComment)

router.post('/:id/add', authmeToken, addComment)

router.post('/:id/delete/:comment_id', authmeToken, deleteComment)

router.get('/:id', loadComment)

router.get('/:id/:parent_comment_id', loadChildComment)

module.exports = router;