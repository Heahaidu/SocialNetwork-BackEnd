const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken')

const { follow, unfollow, follower, following } = require('../controller/followController') 

router.get('/:id/follow', authmeToken, follow)

router.get('/:id/unfollow', authmeToken, unfollow)

router.post('/:id/followers', authmeToken, follower)

router.post('/:id/following', authmeToken, following)

module.exports = router;
