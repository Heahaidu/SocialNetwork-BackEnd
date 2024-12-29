const express = require('express')
const router = express.Router()
const authmeToken = require('../utils/AuthmeToken.js')

const { userRegister, userLogin, userLogout, userLoginByCookie} = require('../controller/userController')

router.post('/register', userRegister)

router.post('/login', userLogin)

router.get('/logout', authmeToken, userLogout)

router.get('/login', authmeToken, userLoginByCookie)

module.exports = router;