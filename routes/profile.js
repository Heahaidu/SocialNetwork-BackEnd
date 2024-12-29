const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken')

const { getProfile, updateProfile , getFollowers, getFollowing} = require('../controller/profileController') 

router.get('/:id', authmeToken, getProfile)

router.post('/profile/update', authmeToken, updateProfile)

router.get('/:id/followers', getFollowers)

router.get('/:id/following', getFollowing)


module.exports = router;