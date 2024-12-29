const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken')

const {likePost, unlikePost } = require('../controller/likeController') 

router.get('/:id/like', authmeToken, likePost)

router.get('/:id/unlike', authmeToken, unlikePost)

module.exports = router;
